import json
from pyarabic.araby import strip_tashkeel

def is_arabic_character(char):
    return '\u0600' <= char <= '\u06FF'

def count_arabic_letters(words):
    letter_counts = {}

    for word in words.values():
        processed_word = strip_tashkeel(word)

        for char in processed_word:
            if is_arabic_character(char):
                letter_counts[char] = letter_counts.get(char, 0) + 1

    return letter_counts

# Function to calculate the grand total of letters
def calculate_grand_total(letter_counts):
    return sum(letter_counts.values())

# Process and print counts for the reindexed file
with open('files/original/reindexed_imlaei-qurancom.json', 'r', encoding='utf-8') as file:
    words = json.load(file)
letter_counts = count_arabic_letters(words)
print("\nReindexed file letter counts:")
print(json.dumps(letter_counts, ensure_ascii=False, indent=4))
print("Grand total:", calculate_grand_total(letter_counts))
