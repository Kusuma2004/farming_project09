# chat.py
import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel("gemini-pro")

@app.route("/ask", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    language = data.get("language", "English")  # default to English

    prompt = f"""
    You are an agricultural assistant. Reply in {language}.
    User asked: "{message}".
    Provide helpful, localized farming advice.
    """

    try:
        response = model.generate_content(prompt)
        return jsonify({ "reply": response.text })
    except Exception as e:
        return jsonify({ "reply": "Sorry, an error occurred." }), 500

if __name__ == "__main__":
    app.run(debug=True)
