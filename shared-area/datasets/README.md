## How to layout datasets

# File structure
Have one folder for your dataset, the name of which should be unique and will be the name of your dataset.  
Then place two directories, training and test, in which place your training data and your test data.  
In the top level you will also need a dataset_cfg.txt file, which acts allows you to describe the characteristics  
of the dataset.  
Example structure:  
DATASET_NAME  
| TRAIN  
| | x.mp3  
| | y.mp3  
| | z.mp3  
| TEST  
| | a.mp3  
| | b.mp3  
| | c.mp3  
| dataset_cfg.txt  
  
# dataset_cfg layout
Your config file describes the features of your dataset.  
The first line is a label schema, and the rest is a mapping, from label to language, this is what will be used  
by the program when describing predictions.  
Example:  
--X (This is the label schema, explaination below)  
en:English  
de:German  
es:Spanish   
  
The label schema tells the program how your audo files are labeled, here are some examples of different  
labels and their schema:
EN_info_info_info.flac = X_  
info_EN_info_info.flac = _X  
info-info-EN-info.flac = --X  