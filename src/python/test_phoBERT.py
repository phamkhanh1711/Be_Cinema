import os
import sys
import joblib
from transformers import AutoModel, AutoTokenizer
import torch
import re
import numpy as np
import underthesea


# Load PhoBERT model and tokenizer
def load_phobert():
    # Tắt cảnh báo FutureWarning của huggingface_hub
    import warnings

    warnings.filterwarnings("ignore", category=FutureWarning)

    phobert_model = AutoModel.from_pretrained("vinai/phobert-base")
    phobert_tokenizer = AutoTokenizer.from_pretrained(
        "vinai/phobert-base", use_fast=False
    )
    return phobert_model, phobert_tokenizer


# Standardize the input text
def standardize_data(row):
    row = re.sub(r"[\.,\?]+$-", "", row)
    row = (
        row.replace(",", " ")
        .replace(".", " ")
        .replace(";", " ")
        .replace("“", " ")
        .replace(":", " ")
        .replace("”", " ")
        .replace('"', " ")
        .replace("'", " ")
        .replace("!", " ")
        .replace("?", " ")
        .replace("-", " ")
        .replace("?", " ")
    )
    row = row.strip().lower()
    return row


# Load PhoBERT model and tokenizer
phobert_model, phobert_tokenizer = load_phobert()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
phobert_model.to(device)


def tokenize_and_convert_to_features(text):
    tokenized_text = underthesea.word_tokenize(text, format="text")
    encoded_text = phobert_tokenizer.encode(tokenized_text, add_special_tokens=False)
    max_len = 100
    if len(encoded_text) < max_len:
        encoded_text = encoded_text + [0] * (max_len - len(encoded_text))
    else:
        encoded_text = encoded_text[:max_len]
    padded = np.array([encoded_text])
    attention_mask = np.where(padded == 0, 0, 1)  # Tạo attention mask
    padded = torch.tensor(padded).to(torch.long)
    attention_mask = torch.tensor(attention_mask)
    with torch.no_grad():
        last_hidden_states = phobert_model(
            input_ids=padded, attention_mask=attention_mask
        )
    return last_hidden_states[0][:, 0, :].numpy()


# ----------------------------------------------
if __name__ == "__main__":
    loaded_model = joblib.load(
        "D:\Capstone 2 - nhom 22\BackEnd-khanh\Be_Cinema\src\python\sentiment_model.joblib"
    )
    if len(sys.argv) > 1:
        input_text = sys.argv[1]
        # Tokenize and convert the input text to features
        input_features = tokenize_and_convert_to_features(input_text)
        # Reshape the features
        input_features = input_features.reshape(1, -1)
        # Predict sentiment
        predicted_sentiment = loaded_model.predict(input_features)
        # Print the predicted sentiment
        print(predicted_sentiment[0])
    else:
        print("No input text provided.")
