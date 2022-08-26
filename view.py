from flask import Flask, render_template, request, url_for, send_file, jsonify, Response

from flask_cors import CORS
import threading
import pickle
import os
import io
import numpy as np
from datetime import datetime

from modules.createFeaturesParallel import create_data
from modules.createMLP import createMLP
from modules.testMLP import testMLP
from modules.predictor import predict


app = Flask(__name__)
CORS(app)

@app.route('/api/getDatasets')
def get_datasets():
    datasets = []
    if "datasets" in next(os.walk('./shared-area/'))[1]:
        datasets = next(os.walk('./shared-area/datasets'))[1]
    return datasets

@app.route('/api/getModels')
def get_models():
    models = []
    if "models" in next(os.walk('./shared-area/'))[1]:  
        models = next(os.walk('./shared-area/models'))[2]
    return models

@app.route('/api/getImage/<image>', methods=['GET'])
def get_image(image):
    try:
        if image in next(os.walk('./shared-area/figures'))[2]:
            return send_file(f'shared-area/figures/{image}', mimetype='image/png')
    except:
        pass
    return send_file(f'static/images/error.png', mimetype='image/png')

@app.route('/api/generateFeatures', methods=['POST'])
def generate_features():
    dataset = request.json["dataset"]
    # check if dataset already has features generated
    datasets = next(os.walk('./shared-area/datasets'))[1]
    if (not dataset in datasets):
        return "ERROR: dataset not found"
    # dataset exists, see if features have been generated
    if not "features" in next(os.walk('./shared-area/'))[1]:
        os.mkdir('./shared-area/features')
    features = next(os.walk('./shared-area/features'))[1]
    if dataset in features:
        return "ERROR: features have already been generated"
    # features have not been generated, so validate the config file
    if not "dataset_cfg.txt" in next(os.walk(f'./shared-area/datasets/{dataset}'))[2]:
        return "ERROR: no config file found for the dataset"
    # config files exists
    with open(f'./shared-area/datasets/{dataset}/dataset_cfg.txt', "r") as file:
        config = file.readlines()
    if len(config) < 2:
        return "ERROR: config file incorrectly setup"
    label_schema = config[0]
    label_map = {}
    for index in range(1, len(config)):
        line_split = config[index].split(':')
        label = line_split[0]
        if index != len(config) - 1:
            text = line_split[1][0:len(line_split[1])-1] ## remove /n
        else:
            text = line_split[1]
        label_map[label] = text 
    # use a new thread to start feature generation, this will allow us to return a message and execute code
    thread = threading.Thread(target=feature_generation_manager, args=(dataset, label_schema, label_map))
    thread.start()
    return f"SUCCESS: feature generation for {dataset} has started, this may take a number of hours"

def feature_generation_manager(dataset, label_schema, label_map):
    print(label_schema)
    print(label_map) 
    os.mkdir(f"./shared-area/features/{dataset}/")
    # get training data
    with open(f"./shared-area/features/{dataset}/log.txt", "w") as log_file:
        log_file.write(f"Feature generation started at {datetime.now()}\n")
    features, labels = create_data(f"./shared-area/datasets/{dataset}/TRAIN/*", label_schema, label_map, dataset)
    np.save(f'./shared-area/features/{dataset}/train-features.npy', features)
    np.save(f'./shared-area/features/{dataset}/train-labels.npy', labels)
    features, labels = create_data(f"./shared-area/datasets/{dataset}/TEST/*", label_schema, label_map, dataset)
    np.save(f'./shared-area/features/{dataset}/test-features.npy', features)
    np.save(f'./shared-area/features/{dataset}/test-labels.npy', labels)
    with open(f"./shared-area/features/{dataset}/log.txt", "a") as log_file:
        log_file.write(f"\nFeature generation completed at {datetime.now()}")

@app.route('/api/generateModel', methods=['POST'])
def generate_model():
    dataset = request.json["dataset"]
    name = request.json["name"]
    createMLP(dataset, name)
    return "SUCCESS: Model successfully generated"

@app.route('/api/testModel', methods=['POST'])
def test_model():
    model = request.json["model"]
    dataset = request.json["dataset"]
    
    # config files exists
    with open(f'./shared-area/datasets/{dataset}/dataset_cfg.txt', "r") as file:
        config = file.readlines()
    label_list = []
    for index in range(1, len(config)):
        line_split = config[index].split(':')
        if index != len(config) - 1:
            label_list.append(line_split[1][0:len(line_split[1])-1]) ## remove /n
        else:
            label_list.append(line_split[1])
    train_acc, test_acc = testMLP(model, dataset, label_list)
    return {
        "train":train_acc,
        "test":test_acc
    }

@app.route('/api/getlang', methods=['POST'])
def get_lang():
    #input_json = request.get_json()
    #print(f"Data from client: {input_json}")
    response = {}
    model = request.form["MODEL_NAME"]
    for filename in request.files.keys():
        file = request.files[filename]
        if not "temp" in  next(os.walk('./'))[1]:
            os.mkdir("./temp/")
        file.save(f"./temp/{filename}")
        data = predict(filename, model)
        response[filename] = data[0]
        response[f'{filename}-eng'] = str(data[1][0])
        response[f'{filename}-ger'] = str(data[1][1])
        response[f'{filename}-spa'] = str(data[1][2])
    return response

@app.route('/creator')
def creator():
    return render_template('creator.html')

@app.route('/classifier')
def classifier():
    return render_template('classifier.html')


if __name__ == "__main__":
    app.run()
    #port = int(os.environ.get('PORT', 5000))
    #app.run(debug=True, host='0.0.0.0', port=port)
