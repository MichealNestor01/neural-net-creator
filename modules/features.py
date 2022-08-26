import librosa
import numpy as np

def feature_chronogram(waveform, sample_rate):
    stft_spectrum_matrix = np.abs(librosa.stft(waveform))
    chronogram = np.mean(librosa.feature.chroma_stft(y=waveform, sr=sample_rate).T, axis=0)
    return chronogram

def feature_melspectrogram(waveform, sample_rate):
    melspectrogram = np.mean(librosa.feature.melspectrogram(y=waveform, sr=sample_rate, n_mels=128, fmax=8000).T, axis=0)
    return melspectrogram

def feature_mfcc(waveform, sample_rate):
    mfc_coefficients=np.mean(librosa.feature.mfcc(y=waveform, sr=sample_rate, n_mfcc=40).T, axis=0)
    return mfc_coefficients

