
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
import joblib
from pathlib import Path

app = FastAPI(title="Student Pass/Fail Predictor")

# Allow requests from the local React/Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Keep this order identical to your notebook's features list
features = [
    "age",
    "studytime",
    "failures",
    "absences",
    "traveltime",
    "schoolsup",
    "famsup",
    "paid",
    "higher",
    "internet",
    "health",
    "goout",
]
MODEL_PATH = Path(__file__).with_name("model.joblib")

model = joblib.load(MODEL_PATH)

scaler = model["scaler"]
weights = model["weights"]
bias = model["bias"]


class StudentInput(BaseModel):
    age: int = Field(ge=15, le=22)
    studytime: int = Field(ge=1, le=4)
    failures: int = Field(ge=0, le=3)
    absences: int = Field(ge=0)
    traveltime: int = Field(ge=1, le=4)
    schoolsup: int = Field(ge=0, le=1)
    famsup: int = Field(ge=0, le=1)
    paid: int = Field(ge=0, le=1)
    higher: int = Field(ge=0, le=1)
    internet: int = Field(ge=0, le=1)
    health: int = Field(ge=1, le=5)
    goout: int = Field(ge=1, le=5)


@app.get("/")
def home():
    return {"message": "Student prediction API is running"}


@app.post("/predict")
def predict_student(student: StudentInput):
    # The API process must load these objects from your trained model.
    # They are not automatically shared with your Jupyter notebook.
    required = ["scaler", "weights", "bias"]

    missing = [name for name in required if name not in globals()]
    if missing:
        raise HTTPException(
            status_code=503,
            detail=(
                "Model is not loaded yet. Missing: "
                + ", ".join(missing)
                + ". Export the fitted scaler, weights, and bias "
                  "from your notebook and load them in api.py."
            ),
        )

    values = student.model_dump()

    row = pd.DataFrame(
        [[values[name] for name in features]],
        columns=features,
    )

    try:
        row_scaled = scaler.transform(row)

        z = float(np.dot(row_scaled[0], weights) + bias)
        probability = float(1 / (1 + np.exp(-z)))

        return {
            "probability": probability,
            "status": "PASS" if probability >= 0.5 else "FAIL",
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {exc}",
        ) from exc
