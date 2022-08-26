import os, glob
import numpy as np
import sys
from joblib import Parallel, delayed, parallel
import multiprocessing
from datetime import datetime

from modules.getFeatures import get_features

def find_split_and_index(label_schema):
    if label_schema[0] == 'X':
        return 0, label_schema[1]
    else:
        for index in label_schema.split(label_schema[0]):
            if label_schema[index] == 'X':
                return index, label_schema[0]

def get_inputs(directory):
    return glob.glob(f"{directory}*")

def process_input(file, label_map, label_split, label_index, dataset, index):
    file_name = os.path.basename(file)
    label = label_map[file_name.split(label_split)[label_index]]
    features = get_features(file)
    if index % 500 == 0:
        with open(f"./shared-area/features/{dataset}/log.txt", "a") as log_file:
            log_file.write(f"{index} FILES SCANNED AT TIME {datetime.now()}\n")
    return features, label

def create_data(directory, label_schema, label_map, dataset):
    label_index, label_split = find_split_and_index(label_schema)
    print(label_index, label_split)
    inputs = get_inputs(directory)
    num_cores = multiprocessing.cpu_count()
    results = Parallel(n_jobs=num_cores)(delayed(process_input)(file, label_map, label_split, label_index, dataset, index) for index, file in enumerate(inputs))
    features, labels = zip(*results)
    return np.array(features), np.array(labels)
