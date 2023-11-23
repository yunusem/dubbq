import json

# Read the original JSON file
with open('../files/original/tr-qurancom.json', 'r', encoding='utf-8') as file:
    surah_data = json.load(file)

# Process and reformat the data
processed_data = {key: {"name": value["translation"]} for key, value in surah_data.items()}

# Write the processed data to a new JSON file
with open('../files/processed/surah_tr.json', 'w', encoding='utf-8') as file:
    json.dump(processed_data, file, ensure_ascii=False, indent=4)