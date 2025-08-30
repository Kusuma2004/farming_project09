# train_model.py
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

# Sample dataset
data = pd.read_csv("Crop_recommendation.csv")

X = data.drop("label", axis=1)
y = data["label"]

model = RandomForestClassifier()
model.fit(X, y)

# Save the model
with open("server/crop_model.pkl", "wb") as f:
    pickle.dump(model, f)
