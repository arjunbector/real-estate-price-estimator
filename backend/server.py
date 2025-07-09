from flask import Flask, request, jsonify
from flask_cors import CORS
import utils
import os 

from dotenv import load_dotenv
load_dotenv()

utils.load_saved_artifacts()

app = Flask(__name__)

CORS(app)


@app.route("/ping")
def hello():
    return "pong"


@app.route('/regions')
def get_regions():
    res = jsonify({
        'regions':utils.get_region_names()
    })
    return res

@app.route('/estimate-price', methods=['POST'])
def estimate_price():
    data = request.get_json()

    bhk = data['bhk']
    area = data['area']
    region = data['region']
    type_ = data['type']

    print(bhk, area, region, type_)

    return jsonify({
        'estimated_price':utils.get_estimated_price(bhk, area, region, type_)
    })




if __name__ == "__main__":
    port = int(os.environ.get("PORT", 4000))
    print(f"Starting server on port {port}...")
    app.run(port=port)