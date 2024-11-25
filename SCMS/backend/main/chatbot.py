import json
import os
import random
import nltk
from nltk.stem import WordNetLemmatizer
from django.conf import settings

nltk.download('punkt', quiet=True)
nltk.download('wordnet', quiet=True)

def load_intents():
    
    file_path = os.path.join(settings.BASE_DIR, 'main', 'chatbot_data.json')
    if not os.path.exists(file_path):
        raise FileNotFoundError("chatbot_data.json file not found")
    
    with open(file_path, 'r') as f:
        return json.load(f)

def get_response(user_input, intents):
    lemmatizer = WordNetLemmatizer()
    for intent in intents['intents']:
        for pattern in intent['patterns']:
            if nltk.edit_distance(user_input.lower(), pattern.lower()) <= 1:
                return random.choice(intent['responses'])
    return random.choice(intents['intents'][-1]['responses'])
