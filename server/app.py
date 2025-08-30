from flask import Flask, request, jsonify
import pickle
import numpy as np
import pandas as pd
from flask_cors import CORS
import os
import google.generativeai as genai
from flask_pymongo import PyMongo
from datetime import datetime
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token, get_jwt_identity
)
import bcrypt

app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = "mongodb://localhost:27017/farmingDB"
app.config["JWT_SECRET_KEY"] = "supersecretkey" 
app.config["GOOGLE_API_KEY"]="AIzaSyB9Xc27FCSp4HprhjHnmr3tkMGox5ZIKkQ" # Use env var in prod!
mongo = PyMongo(app)
jwt = JWTManager(app)

# Load ML models and encoders
crop_model = pickle.load(open("crop_model.pkl", "rb"))
fertilizer_model = pickle.load(open("fertilizer_model.pkl", "rb"))
label_encoders = pickle.load(open("fertilizer_label_encoders.pkl", "rb"))
dtr = pickle.load(open("dtr.pkl", "rb"))
preprocessor = pickle.load(open("preprocessor.pkl", "rb"))


# Replace with your actual key
genai.configure(api_key="AIzaSyCepHKr_tgW9sO1I6482ue6mqBRdeDj6c8")

# ✅ Use model name directly, no "models/" prefix
model = genai.GenerativeModel("models/gemini-1.5-flash")



@app.route("/ask", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        message = data.get("message", "").strip()
        language = data.get("language", "English").strip()

        if not message:
            return jsonify({ "reply": "Please say or type something to get a response." }), 400

        concise_triggers = [
            "decrease the matter", "reduce the matter", "make it short",
            "shorten", "in brief", "bullet points", "summarize", "short reply"
        ]
        concise = any(trigger in message.lower() for trigger in concise_triggers)

        prompt = f"""You are an agricultural assistant.Reply in {language}.
User said: "{message}"
{"Respond only in clear, short bullet points." if concise else "Provide detailed and localized farming advice."}"""


        result = model.generate_content(prompt.strip())

        return jsonify({ "reply": result.text })

    except Exception as e:
        print("Error:", e)
        return jsonify({ "reply": "Something went wrong while processing your request." }), 500




# --- JWT error handlers for clarity ---
@jwt.unauthorized_loader
def custom_unauthorized_response(err):
    return jsonify({"error": "Missing or invalid JWT", "message": err}), 401

@jwt.invalid_token_loader
def custom_invalid_token_response(err):
    return jsonify({"error": "Invalid JWT token", "message": err}), 401

@jwt.expired_token_loader
def custom_expired_token_response(jwt_header, jwt_payload):
    return jsonify({"error": "JWT token expired"}), 401

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    if mongo.db.users.find_one({"email": data["email"]}):
        return jsonify({"msg": "User already exists"}), 409
    hashed_pw = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())
    mongo.db.users.insert_one({
        "email": data["email"],
        "name": data.get("name"),
        "password": hashed_pw
    })
    return jsonify({"msg": "User created"}), 201

# --- User Login ---
@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    user = mongo.db.users.find_one({"email": data["email"]})
    if user and bcrypt.checkpw(data["password"].encode("utf-8"), user["password"]):
        access_token = create_access_token(identity=str(user["_id"]))
        return jsonify({
    "token": access_token,
    "user": {
        "name": user.get("name", "User"),
        "email": user["email"]
    }
})
    
# --- Save prediction helper ---
def save_prediction(collection, user_id, data_dict):
    data_dict.update({
        "userId": user_id,
        "createdAt": datetime.utcnow()
    })
    mongo.db[collection].insert_one(data_dict)

# --- Crop recommendation prediction ---
@app.route("/predict", methods=["POST"])
@jwt_required()
def predict_crop():
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        features = [
            float(data.get("N")),
            float(data.get("P")),
            float(data.get("K")),
            float(data.get("temperature")),
            float(data.get("humidity")),
            float(data.get("ph")),
            float(data.get("rainfall")),
        ]
        prediction = crop_model.predict([features])[0]
        save_prediction("crop_predictions", user_id, {"cropRecommendation": prediction})
        return jsonify({"recommended_crop": prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# --- Fertilizer recommendation ---
@app.route("/fertilizer-predict", methods=["POST"])
@jwt_required()
def recommend_fertilizer():
    user_id = get_jwt_identity()
    try:
        data = request.get_json()
        encoded_soil = label_encoders["Soil_Type"].transform([data["soil_type"]])[0]
        encoded_crop = label_encoders["Crop_Type"].transform([data["crop_type"]])[0]

        input_df = pd.DataFrame([{
            "Temparature": float(data["temperature"]),
            "Humidity": float(data["humidity"]),
            "Moisture": float(data["moisture"]),
            "Soil_Type": encoded_soil,
            "Crop_Type": encoded_crop,
            "Nitrogen": float(data["nitrogen"]),
            "Potassium": float(data["potassium"]),
            "Phosphorous": float(data["phosphorous"])
        }])

        prediction_encoded = fertilizer_model.predict(input_df)[0]
        prediction_label = label_encoders["Fertilizer"].inverse_transform([prediction_encoded])[0]

        save_prediction("fertilizer_recommendations", user_id, {
            "fertilizerType": prediction_label,
            "crop": data["crop_type"]
        })
        return jsonify({"recommended_fertilizer": prediction_label})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/cropyield-predict", methods=["POST"])
@jwt_required()
def predict_yield():
    user_id = get_jwt_identity()
    try:
        data = request.get_json()
        required_fields = ["Year", "average_rain_fall_mm_per_year", "pesticides_tonnes", "avg_temp", "Area", "Item"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        input_df = pd.DataFrame([{
            "Year": int(data["Year"]),
            "average_rain_fall_mm_per_year": float(data["average_rain_fall_mm_per_year"]),
            "pesticides_tonnes": float(data["pesticides_tonnes"]),
            "avg_temp": float(data["avg_temp"]),
            "Area": data["Area"],        # keep as string
            "Item": data["Item"]         # string
        }])

        X_transformed = preprocessor.transform(input_df)
        prediction = dtr.predict(X_transformed)[0]

        save_prediction("yield_predictions", user_id, {
    **data,
    "predictedYield": prediction,
    "crop": data.get("Item")  # Save Item as crop explicitly
})


        return jsonify({"prediction": round(prediction, 2)})

    except Exception as e:
        return jsonify({"error": str(e)}), 400
from flask_jwt_extended import jwt_required, get_jwt_identity

@app.route("/api/crop-predictions", methods=["GET"])
@jwt_required()
def get_crop_predictions():
    user_id = get_jwt_identity()
    predictions = list(mongo.db.crop_predictions.find({"userId": user_id}).sort("createdAt", -1))
    for p in predictions:
        p["_id"] = str(p["_id"])
        p["createdAt"] = p.get("createdAt").strftime("%Y-%m-%dT%H:%M:%S")
    return jsonify(predictions)

@app.route("/api/fertilizer-recommendations", methods=["GET"])
@jwt_required()
def get_fertilizer_recommendations():
    user_id = get_jwt_identity()
    recommendations = list(mongo.db.fertilizer_recommendations.find({"userId": user_id}).sort("createdAt", -1))
 
    for r in recommendations:
        r["_id"] = str(r["_id"])
        r["createdAt"] = r.get("createdAt").strftime("%Y-%m-%dT%H:%M:%S")
    return jsonify(recommendations)

@app.route("/api/yield-predictions", methods=["GET"])
@jwt_required()
def get_yield_predictions():
    user_id = get_jwt_identity()
    yield_preds = list(mongo.db.yield_predictions.find({"userId": user_id}).sort("createdAt", -1))
    for y in yield_preds:
        y["_id"] = str(y["_id"])
        y["createdAt"] = y.get("createdAt").strftime("%Y-%m-%dT%H:%M:%S")
        print("value",yield_preds)
    return jsonify(yield_preds)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

