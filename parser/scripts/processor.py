import json
from pyarabic.araby import strip_tashkeel

def is_arabic_character(char):
    return '\u0600' <= char <= '\u06FF'

def process_quran(surah_data, quran_data):
    global_index = 1
    surah_info = {}

    for surah_key, surah_info in surah_data.items():
        surah_start = surah_info['start']
        surah_end = surah_info['end']
        surah_letters_count = 0

        for ayah_key in range(surah_start, surah_end + 1):
            ayah_text = quran_data[str(ayah_key)]
            processed_ayah = strip_tashkeel(ayah_text)
            ayah_letters_info = []

            for char in processed_ayah:
                if is_arabic_character(char):
                    ayah_letters_info.append({"character": char, "global_index": global_index})
                    global_index += 1
                    surah_letters_count += 1

            surah_info.setdefault("ayahs", []).append({"ayah_index": ayah_key, "letters": ayah_letters_info})

        surah_info['total_letters'] = surah_letters_count

    return surah_data

# Load the JSON data
with open('files/processed/reindexed-surah.json', 'r', encoding='utf-8') as file:
    surah_data = json.load(file)
with open('quran.json', 'r', encoding='utf-8') as file:
    quran_data = json.load(file)

# Process the Quran data
new_dataset = process_quran(surah_data, quran_data)

# Output the new dataset
with open('processed_quran_dataset.json', 'w', encoding='utf-8') as file:
    json.dump(new_dataset, file, ensure_ascii=False, indent=4)

print("Processed Quran dataset created successfully.")
