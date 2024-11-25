# chatbot.py

import json
import random
import nltk
from nltk.stem import WordNetLemmatizer

# Download necessary NLTK resources
nltk.download('punkt', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('punkt_tab', quiet=True)  # Add this to download punkt_tab

# Load intents from JSON file
def load_intents(file_path='chatbot_data.json'):
    with open(file_path, 'r') as f:
        return json.load(f)

# Prepare data for training
def prepare_data(intents):
    lemmatizer = WordNetLemmatizer()
    all_words = []
    tags = []
    patterns = []
    
    for intent in intents['intents']:
        for pattern in intent['patterns']:
            words = nltk.word_tokenize(pattern)
            all_words.extend(words)
            patterns.append(pattern)
            tags.append(intent['tag'])
    
    all_words = [lemmatizer.lemmatize(w.lower()) for w in all_words if w.isalpha()]
    all_words = sorted(set(all_words))
    tags = sorted(set(tags))
    
    return all_words, tags, patterns

# Generate a response based on user input
def get_response(user_input, intents):
    all_words, tags, patterns = prepare_data(intents)
    
    # Preprocess user input
    user_words = nltk.word_tokenize(user_input)
    user_words = [WordNetLemmatizer().lemmatize(word.lower()) for word in user_words if word.isalpha()]

    # Check for a matching tag
    for intent in intents['intents']:
        for pattern in intent['patterns']:
            if nltk.edit_distance(user_input.lower(), pattern.lower()) <= 1:  # Allow for minor typos
                return random.choice(intent['responses'])
    
    return random.choice(intents['intents'][-1]['responses'])  # Fallback response

def main():
    intents = load_intents()
    print("Chatbot is running! Type 'exit' to end the conversation.")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'exit':
            print("Chatbot: Goodbye!")
            break
        
        response = get_response(user_input, intents)
        print(f"Chatbot: {response}")

if __name__ == "__main__":
    main()
