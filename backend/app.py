from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware


model = joblib.load("gut_model.pkl")
cat_encoder = joblib.load("categorical_encoder.pkl")
symptom_encoder = joblib.load("symptom_encoder.pkl")
label_encoder = joblib.load("label_encoder.pkl")

print("MODEL EXPECTS FEATURES:")
print(model.feature_names_in_)
print(len(model.feature_names_in_))


CONFIDENCE_THRESHOLD = 0.45

app = FastAPI(
    title="GutSense API",
    description="Gut health risk guidance API (non-diagnostic)",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # allows POST, OPTIONS, etc.
    allow_headers=["*"],
)


class UserInput(BaseModel):
    stool_type: int
    stool_color: str
    water_intake: str
    fiber_intake: str
    food_type: str
    stress_level: int
    time_since_meal_hours: int
    symptoms: list[str]  # e.g. ["bloating", "cramps"]

def preprocess_input(data: UserInput):
    # ---------- BASE NUMERIC FEATURES ----------
    base_df = pd.DataFrame([{
        "stool_type": data.stool_type,
        "stress_level": data.stress_level,
        "time_since_meal_hours": data.time_since_meal_hours
    }])

    # ---------- CATEGORICAL FEATURES ----------
    cat_features = ["stool_color", "water_intake", "fiber_intake", "food_type"]
    cat_input = pd.DataFrame([{
        "stool_color": data.stool_color,
        "water_intake": data.water_intake,
        "fiber_intake": data.fiber_intake,
        "food_type": data.food_type
    }])

    cat_encoded = cat_encoder.transform(cat_input)

    cat_df = pd.DataFrame(
        cat_encoded,
        columns=cat_encoder.get_feature_names_out(cat_features)
    )

    # ---------- SYMPTOMS (MULTI-LABEL) ----------
    symptom_encoded = symptom_encoder.transform([data.symptoms])

    symptom_df = pd.DataFrame(
        symptom_encoded,
        columns=[f"symptom_{s}" for s in symptom_encoder.classes_]
    )

    # ---------- COMBINE ----------
    final_df = pd.concat(
        [base_df, cat_df, symptom_df],
        axis=1
    )

    # ---------- ALIGN EXACTLY WITH TRAINING ----------
    expected_cols = list(model.feature_names_in_)

    # Add missing columns
    for col in expected_cols:
        if col not in final_df.columns:
            final_df[col] = 0

    # Remove extra columns
    final_df = final_df[expected_cols]

    return final_df

@app.post("/predict")
# def predict(input_data: UserInput):

#     X = preprocess_input(input_data)

#     probs = model.predict_proba(X)[0]
#     max_prob = float(np.max(probs))
#     pred_index = int(np.argmax(probs))
#     pred_label = label_encoder.inverse_transform([pred_index])[0]

#     # Confidence-based rejection
#     if max_prob < CONFIDENCE_THRESHOLD:
#         return {
#             "status": "uncertain",
#             "confidence": round(max_prob, 3),
#             "message": (
#                 "Insufficient confidence to provide guidance. "
#                 "Please consult a medical professional if symptoms persist."
#             )
#         }

#     return {
#         "status": "success",
#         "prediction": pred_label,
#         "confidence": round(max_prob, 3),
#         "disclaimer": (
#             "This result is for educational purposes only and "
#             "does not constitute medical diagnosis."
#         )
#     }
def predict(input_data: UserInput):

    # 1️⃣ Preprocess input
    X = preprocess_input(input_data)

    # 2️⃣ Model prediction
    probs = model.predict_proba(X)[0]
    max_prob = float(np.max(probs))
    pred_index = int(np.argmax(probs))
    pred_label = label_encoder.inverse_transform([pred_index])[0]

    # 3️⃣ Confidence-based rejection
    if max_prob < CONFIDENCE_THRESHOLD:
        return {
            "status": "uncertain",
            "confidence": round(max_prob, 3),
            "message": (
                "Insufficient confidence to provide guidance. "
                "Please consult a medical professional if symptoms persist."
            )
        }

    # 4️⃣ Build initial result
    result = {
        "status": "success",
        "prediction": pred_label,
        "confidence": round(max_prob, 3),
        "disclaimer": (
            "This result is for educational purposes only and "
            "does not constitute medical diagnosis."
        )
    }

    # 5️⃣ ✅ MEDICAL OVERRIDE (POST-PROCESSING RULE)
    if (
        input_data.stool_type in [1, 2]
        and input_data.water_intake == "low"
        and result["prediction"] == "Healthy"
    ):
        result["prediction"] = "Constipation"
        result["confidence"] = max(result["confidence"], 0.7)

    # 6️⃣ Return final result
    return result


@app.get("/")
def health():
    return {"status": "API is running"}
