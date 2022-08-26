import numpy as np
import pandas as pd
import pickle
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sn
import os

def testMLP(model_name, dataset, label_list):
    train_features = np.load(f'./shared-area/features/{dataset}/train-features.npy', allow_pickle=True)
    train_labels = np.load(f'./shared-area/features/{dataset}/train-labels.npy', allow_pickle=True)

    test_features = np.load(f'./shared-area/features/{dataset}/test-features.npy', allow_pickle=True)
    test_labels = np.load(f'./shared-area/features/{dataset}/test-labels.npy', allow_pickle=True)

    model = pickle.load(open(f"./shared-area/models/{model_name}", 'rb'))

    training_accuracy = 100 * model.score(train_features, train_labels)
    test_accuracy = 100 * model.score(test_features, test_labels)

    # now generate confusion matrix

    # get predicitions on test set
    test_language_predictions = model.predict(test_features)
    test_language_groundtruth = test_labels

    # build confusion matrix
    conf_matrix = confusion_matrix(test_language_groundtruth, test_language_predictions)
    conf_matrix_norm = confusion_matrix(test_language_groundtruth, test_language_predictions, normalize='true')

    # set labels for matric axes from languages
    language_list = [lang for lang in label_list]
    language_name = [lang for lang in label_list]

    # make a confusion matrix with labels using a dataframe
    confmatrix_df_norm = pd.DataFrame(conf_matrix_norm, index=language_name, columns=language_name)

    # plot confusion matrices
    plt.figure(figsize=(16,16))
    sn.set(font_scale=1.8)
    plt.subplot(1, 1, 1)
    plt.title('Confusion Matrix')
    sn.heatmap(confmatrix_df_norm, annot=True, annot_kws={"size": 18})

    # save the model
    if not "figures" in  next(os.walk('./shared-area/'))[1]:
        os.mkdir("./shared-area/figures")

    plt.savefig(f'./shared-area/figures/confusionmatrix-{model_name}-{dataset}.png')

    return training_accuracy, test_accuracy