import json
from pyarabic.araby import strip_tashkeel

def is_arabic_character(char):
    return '\u0600' <= char <= '\u06FF'

def parse_arabic_sentence_to_json(arabic_sentence):
    processed_sentence = strip_tashkeel(arabic_sentence)
    
    char_list = []
    char_index = 1  # Start index from 1

    for char in processed_sentence:
        if char.isspace() or not is_arabic_character(char):
            continue

        char_list.append({"character": char, "index": char_index})
        char_index += 1  # Increment only for Arabic characters

    json_output = json.dumps(char_list, ensure_ascii=False, indent=4)

    return json_output

# Example usage
arabic_sentence = "بسم الله الرحمن الرحيم"
arabic_sentence = "بسم الله الرحمن الرحيم" 

parsed_json = parse_arabic_sentence_to_json(arabic_sentence)
print(parsed_json)

print(7 + 286 + 200 + 176 + 120 + 165 + 206 + 75 + 127);