# Student-Performance-Predictor
Student Exam Pass/Fail Predictor using Logistic Regression. Built the Python ML backend independently, implemented gradient descent from scratch with NumPy, performed preprocessing, feature scaling, model training and testing, and integrated predictions using FastAPI. Frontend created with AI assistance using React, TypeScript, and Tailwind CSS.



# Student Performance Predictor

An end-to-end **Student Exam Pass/Fail Prediction System** built using Logistic Regression, Python, NumPy, FastAPI, React, TypeScript, and Tailwind CSS.

The application estimates a student's probability of passing based on 12 demographic, academic, educational-support, and lifestyle features.

## Features

- Logistic Regression implemented from scratch using NumPy.
- Gradient descent for model parameter optimization.
- Data preprocessing and feature standardization using `StandardScaler`.
- Training and testing using the Student Performance dataset.
- Saved model parameters and scaler for inference.
- FastAPI REST API for predictions.
- React and TypeScript frontend with interactive inputs.
- Visual pass-probability gauge and PASS/FAIL classification.
- Input validation and a responsive interface.

## Tech Stack

**Machine Learning:** Python, NumPy, Pandas, scikit-learn  
**Backend:** FastAPI, Uvicorn, Joblib  
**Frontend:** React, TypeScript, Vite, Tailwind CSS  
**Dataset:** UCI Student Performance Dataset

## Project Structure

```text
Student-Performance-Predictor/
├── backend/
│   ├── api.py
│   ├── model.joblib
│   └── Exam Pass or Fail.ipynb
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── student dataset/
│   ├── student-mat.csv
│   ├── student-por.csv
│   └── student.txt
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before starting:

- **Python 3.10 or newer** (use a version supported by your installed ML dependencies).
- **Node.js LTS and npm**
- **Git**

Check your installations:

```bash
python3 --version
node --version
npm --version
git --version
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Rahul2006MILLION/Student-Performance-Predictor.git
cd Student-Performance-Predictor
```

### 2. Set up the Python backend

From the project root:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install fastapi "uvicorn[standard]" pandas numpy scikit-learn joblib
```

On Windows, activate the virtual environment using:

```powershell
.venv\Scripts\activate
```

### 3. Start the backend

From the project root, with the virtual environment activated:

```bash
python -m uvicorn backend.api:app --host 127.0.0.1 --port 8000 --reload
```

If startup succeeds, the API will be available at:

- API: http://127.0.0.1:8000
- Interactive API documentation: http://127.0.0.1:8000/docs

Open the documentation page to inspect the prediction endpoint and test requests.

**Note:** The backend expects the saved model at `backend/model.joblib`. Keep this file in its expected location. The API must load the existing trained model and scaler; cloning the repository should not require retraining the model.

### 4. Set up the frontend

Open a **second terminal** from the project root:

```bash
cd frontend
npm install
```

### 5. Start the frontend

```bash
npm run dev
```

Open the local URL printed by Vite, typically:

http://localhost:5173

Keep both terminals running while using the application.

## How to Use

1. Open the frontend in your browser.
2. Enter the student's information using the 12 available features.
3. Select **Predict Exam Outcome**.
4. The frontend sends the inputs to the FastAPI backend.
5. The backend applies the saved scaler and trained Logistic Regression parameters.
6. The application displays the estimated pass probability and PASS/FAIL classification.

The decision threshold is 0.50: probabilities of at least 0.50 are classified as PASS; lower probabilities are classified as FAIL.

## Model Methodology

The model follows this pipeline:

1. Load and inspect the student performance data.
2. Select the 12 input features and construct the binary target.
3. Split the data into training and testing sets.
4. Standardize the features using `StandardScaler`, fitting it on training data only.
5. Train Logistic Regression by implementing the cost function, gradients, and gradient descent using NumPy.
6. Evaluate the trained model on held-out test data.
7. Save the trained weights, bias, and scaler for API inference.

The prediction is calculated using the logistic sigmoid:

\[
P(\text{Pass})=\frac{1}{1+e^{-(w^T x+b)}}
\]

Here, \(x\) represents the standardized input features, \(w\) the
