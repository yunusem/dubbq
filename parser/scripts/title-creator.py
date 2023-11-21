import json
import re

def extract_titles_and_clean_ayahs(ayahs):
    titles = {}
    cleaned_ayahs = {}
    for ayah_key, text in ayahs.items():
        surah_number, ayah_number = ayah_key.split(':')
        next_ayah_number = int(ayah_number) + 1

        # Check if the Ayah does not end with typical punctuation
        if not text.strip().endswith(('.', '?', ';', ',', '─', '—', '!')):
            last_punctuation_pos = max([text.rfind(punc) for punc in ['.', '?', ';', ',', '─', '—', '!']])
            # Extract the title, considering an ending single quote as part of the title
            title = text[last_punctuation_pos+1:].strip() if last_punctuation_pos != -1 else text.strip()
            # If the title starts with a single quote, remove it and add it back to the Ayah text
            if title.startswith("’"):
                title = title[1:].strip()
                text = text[:last_punctuation_pos+1] + "’"  # Add back the single quote to the Ayah
            else:
                text = text[:last_punctuation_pos+1].strip() if last_punctuation_pos != -1 else ''
        else:
            title = None

        if title:
            titles.setdefault(surah_number, {})[str(next_ayah_number)] = title
        cleaned_ayahs[ayah_key] = text  # Retain the original text

    return titles, cleaned_ayahs

def reindex_ayah_numbers(verses):
    global_index = 1
    reindexed_verses = {}

    for key in sorted(verses.keys(), key=lambda x: (int(x.split(':')[0]), int(x.split(':')[1]))):
        reindexed_verses[str(global_index)] = verses[key]
        global_index += 1

    return reindexed_verses

# Read scrapped Quran data
with open('files/original/quran_scrapped_data.json', 'r', encoding='utf-8') as file:
    all_ayahs = json.load(file)

# Extract titles and clean Ayahs
titles, cleaned_ayahs = extract_titles_and_clean_ayahs(all_ayahs)

# Save titles to a file
with open('files/processed/titles.json', 'w', encoding='utf-8') as file:
    json.dump(titles, file, ensure_ascii=False, indent=2)

# Re-index cleaned Ayahs and save to quran_tr.json
reindexed_cleaned_ayahs = reindex_ayah_numbers(cleaned_ayahs)
with open('files/processed/quran_tr.json', 'w', encoding='utf-8') as file:
    json.dump(reindexed_cleaned_ayahs, file, ensure_ascii=False, indent=2)
