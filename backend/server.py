from flask import Flask, request, jsonify
import utils

utils.load_saved_artifacts()

app = Flask(__name__)


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
    print("Starting server...")
    app.run()