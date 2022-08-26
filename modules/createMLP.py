import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
import pickle
import os

def createMLP(dataset, model_name):
    features = np.load(f'./shared-area/features/{dataset}/train-features.npy', allow_pickle=True)
    labels = np.load(f'./shared-area/features/{dataset}/train-labels.npy', allow_pickle=True)

    # it has been seen that taking a random subset of 60% of the training data yeilds more accurate results
    train_features, validate_features, train_labels, validate_labels = train_test_split(
        features, 
        labels,
        test_size=0.4,
        random_state=69
    )

    # we have found these to be the most optimal settings for language detection
    model = MLPClassifier(
        max_iter=2000,
        batch_size=255,
        random_state=69,
        activation='logistic',
        alpha=5,
        epsilon=1e-08,
        hidden_layer_sizes=(100, ),
        learning_rate='adaptive',
        solver='adam'
    )

    # train the model
    model.fit(train_features, train_labels)

    # save the model
    if not "models" in  next(os.walk('./shared-area/'))[1]:
        os.mkdir("./shared-area/models")

    pickle.dump(model, open(f"./shared-area/models/{model_name}", "wb"))
