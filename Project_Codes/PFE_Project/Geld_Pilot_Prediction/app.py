from flask import Flask, jsonify
import tensorflow as tf
import numpy as np
import pandas as pd
from pymongo import MongoClient
from flask import Flask, request, jsonify


app = Flask(__name__)



if __name__ == "__main__":
    app.run(port=5001, debug=False)