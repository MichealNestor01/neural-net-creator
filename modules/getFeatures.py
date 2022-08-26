import soundfile

from modules.features import *

def get_features(file, chro=True, mel=True, mfc=True):
    with soundfile.SoundFile(file) as audio:
        waveform = audio.read(dtype="float32")
        sample_rate = audio.samplerate
        chronogram = feature_chronogram(waveform, sample_rate)
        melspectrogram = feature_melspectrogram(waveform, sample_rate)
        mfc_coefficients = feature_mfcc(waveform, sample_rate)

        feature_map = {
            "chro":[chro, chronogram],
            "mel":[mel, melspectrogram],
            "mfc":[mfc, mfc_coefficients]
        }
        final_features = []
        for key in feature_map.keys():
            if feature_map[key][0]:
                final_features.append(feature_map[key][1])

        feature_matrix = np.array([])
        #feature_matrix = np.hstack((chronogram, melspectrogram, mfc_coefficients))
        feature_matrix = np.hstack(tuple(final_features))

        return feature_matrix