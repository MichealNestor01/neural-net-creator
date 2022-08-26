import numpy as np
import pickle
from sklearn.neural_network import MLPClassifier
from modules.getFeatures import get_features
import os

def predict(filename, model):
    loaded_model = pickle.load(open(f"./shared-area/models/{model}", 'rb'))
    sample = get_features(f"./temp/{filename}")
    os.remove(f"./temp/{filename}") 
    probabilities = loaded_model.predict_proba(np.array(sample).reshape(1, -1))[0]
    prediction = loaded_model.predict(np.array(sample).reshape(1, -1))[0]
    return [prediction, probabilities]
