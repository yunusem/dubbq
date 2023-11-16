import json


def adjust_indexes(data):
    iterator_index = 1
    data['9']['nAyah'] = 127
    for key in range(1, len(data) + 1):
        str_key = str(key)
        data[str_key]['start'] = iterator_index
        data[str_key]['end'] = data[str_key]['start'] + data[str_key]['nAyah'] - 1

        iterator_index = data[str_key]['end'] + 1

    return data


# Load the JSON data
with open('surah.json', 'r', encoding='utf-8') as file:
    surah_data = json.load(file)

# Adjust the indexes starting from the 9th element
corrected_surah_data = adjust_indexes(surah_data)

# Save the adjusted data
with open('reindexed-surah.json', 'w', encoding='utf-8') as file:
    json.dump(corrected_surah_data, file, ensure_ascii=False, indent=4)

print("Indexes adjusted and saved in 'reindexed-surah.json'.")
