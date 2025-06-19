import json
import pickle
import numpy as np
import pandas as pd

__regions = None
__data_columns = None
__model = None

def get_region_names():
    return __regions

def get_estimated_price(bhk, area, region, type):
    # Set one-hot encoded region and type
    region_col = 'region_' + region
    type_col = 'type_' + type
    
    try:
        region_index = __data_columns.index(region_col.lower())
        type_index = __data_columns.index(type_col.lowe())
    except:
        region_index = -1
        type_index = -1

    x = np.zeros(len(__data_columns))

    # Set bhk and area by column name to avoid column order issues
    x[0] = bhk
    x[1] = area

    # Predict using the model with proper feature names
    return round(__model.predict(pd.DataFrame([x], columns=__data_columns))[0], 2)


def load_saved_artifacts():
    global __data_columns
    global __regions
    global __model

    with open('artifacts/columns.json', 'r') as f:
        __data_columns = json.load(f)['data_columns']
        __regions = __data_columns[3:]
    
    with open('artifacts/model', 'rb') as f:
        __model = pickle.load(f)
    
    print('loading saved artifacts...done')


if __name__ == "__main__":
    load_saved_artifacts()