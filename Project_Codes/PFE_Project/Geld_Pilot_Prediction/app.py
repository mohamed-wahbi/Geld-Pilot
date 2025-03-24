from flask import Flask, jsonify
import tensorflow as tf
import numpy as np
import pandas as pd
from pymongo import MongoClient
from flask import Flask, request, jsonify


app = Flask(__name__)

# Connexion MongoDB
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["Geld_Pilot"]

# Charger les données
def get_finance_data():
    monthly_data = list(db.monthlyfinancetrainmls.find({}, {"_id": 0}))
    annual_data = list(db.annualfinancetrainmls.find({}, {"_id": 0}))

    df_monthly = pd.DataFrame(monthly_data)
    df_annual = pd.DataFrame(annual_data)

    if df_monthly.empty:
        print("⚠️ Aucune donnée récupérée depuis MonthlyFinanceTrainML !")
    else:
        print("Colonnes disponibles dans df_monthly :", df_monthly.columns)

    if df_annual.empty:
        print("⚠️ Aucune donnée récupérée depuis AnnualFinanceTrainML !")
    else:
        print("Colonnes disponibles dans df_annual :", df_annual.columns)

    return df_monthly, df_annual




if __name__ == "__main__":
    app.run(port=5001, debug=False)