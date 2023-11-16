import requests
from bs4 import BeautifulSoup
import re
import json

def clean_text(text, surah_number, ayah_number):
    # Replace non-breaking space with regular space and remove special characters at the last 2698 118123
    text = text.replace(u'\u00a0', ' ').replace('*', '').replace('\n', '').replace('“', '').replace('”', '').replace('] ', '').replace('[', '').replace('Dipnot', '').replace(' 2698 ', '').replace('118123 ', '')

    # Define patterns for ayah numbers (with and without space after colon)
    ayah_number_patterns = [f"{surah_number}: {ayah_number}", f"{surah_number}:{ayah_number}"]

    # Remove the ayah number from the beginning of the text if it's there
    for pattern in ayah_number_patterns:
        if text.startswith(pattern):
            text = text.replace(pattern, '').strip()
            break  # Exit loop once the pattern is found and replaced

    if surah_number == 80 and 35 <= ayah_number <= 42:
        # Find the next Ayah number in the sequence and extract only the relevant part of the current Ayah
        next_ayah_number = ayah_number + 1 if ayah_number < 42 else None
        if next_ayah_number:
            # Look for the start of the next Ayah number in the text and slice the text up to that point
            next_ayah_pattern = f"{surah_number}: {next_ayah_number}"
            
            next_ayah_start = text.find(next_ayah_pattern)
            if next_ayah_start != -1:
                text = text[:next_ayah_start].strip()
        else:
            # If this is the last Ayah in the sequence, remove any trailing numbers and colons
            text = re.sub(r'\d+:?\s?', '', text)
    else:
        # For other Ayahs, remove the Ayah number from the beginning of the text
        ayah_number_pattern = f"{surah_number}:{ayah_number}"
        text = text.replace(ayah_number_pattern, '').strip()

    return text



def fetch_surah_ayahs(surah_number, surah_info):
    url = f"https://teslimolan.org/kuransure.php?sureid={surah_number}"
    response = requests.get(url)
    html_content = response.text

    ayahs = {}
    expected_num_ayahs = surah_info[str(surah_number)]["nAyah"]

    for ayah_num in range(1, expected_num_ayahs + 1):
        current_ayah_pattern = ''
        next_ayah_pattern = ''
        if surah_number == 80 and ayah_num in [35,36,37,38,39,40,41,42]:
            current_ayah_pattern = re.compile(f"\[{surah_number}:.*?{ayah_num}")
            next_ayah_pattern = re.compile(f"\[{surah_number}:?{ayah_num + 1}") if ayah_num < expected_num_ayahs else None

        else:
            current_ayah_pattern = re.compile(f"\[{surah_number}:{ayah_num}")
            next_ayah_pattern = re.compile(f"\[{surah_number}:{ayah_num + 1}") if ayah_num < expected_num_ayahs else None

        current_ayah_match = current_ayah_pattern.search(html_content)
        next_ayah_match = next_ayah_pattern.search(html_content) if next_ayah_pattern else None

        if current_ayah_match:
            start_pos = current_ayah_match.start()
            # Special handling for Surah 80, ayahs 36 to 42
            if surah_number == 80 and 36 <= ayah_num <= 42:
                # Search for the start of the next ayah number in the text
                end_pos = html_content.find(f"[{surah_number}:{ayah_num + 1}]", start_pos)
                end_pos = end_pos if end_pos != -1 else len(html_content)
            else:
                end_pos = next_ayah_match.start() if next_ayah_match else len(html_content)

            ayah_text = html_content[start_pos:end_pos]
            ayah_text = BeautifulSoup(ayah_text, 'html.parser').get_text(" ", strip=True)

            ayah_key = f"{surah_number}:{ayah_num}"
            ayahs[ayah_key] = clean_text(ayah_text, surah_number, ayah_num)

    return ayahs


def reindex_ayah_numbers(verses):
    global_index = 1
    reindexed_verses = {}

    for key in sorted(verses.keys(), key=lambda x: (int(x.split(':')[0]), int(x.split(':')[1]))):
        reindexed_verses[str(global_index)] = verses[key]
        global_index += 1

    return reindexed_verses

def verify_ayahs_fetched(surah_number, fetched_ayahs, surah_info):
    expected_count = surah_info[str(surah_number)]["nAyah"]

    # Creating sets for comparison
    expected_ayahs = set(range(1, expected_count + 1))
    actual_ayahs = set(int(ayah.split(':')[1]) for ayah in fetched_ayahs.keys())

    # Finding missing Ayahs
    missing_ayahs = expected_ayahs - actual_ayahs

    if missing_ayahs:
        print(f"Warning: Missing Ayahs in Surah {surah_number}:{sorted(missing_ayahs)}")

def read_surah_info():
    with open('reindexed-surah.json', 'r', encoding='utf-8') as file:
        return json.load(file)

# Read Surah Information
surah_info = read_surah_info()

# Fetching and verifying Ayahs
all_ayahs = {}
for surah_number in range(1, 115):
    surah_ayahs = fetch_surah_ayahs(surah_number, surah_info)
    verify_ayahs_fetched(surah_number, surah_ayahs, surah_info)
    all_ayahs.update(surah_ayahs)

# Re-indexing Ayahs
reindexed_ayahs = reindex_ayah_numbers(all_ayahs)
#reindexed_ayahs = all_ayahs
# Writing to a JSON file
with open('quran_tr.json', 'w', encoding='utf-8') as file:
    json.dump(reindexed_ayahs, file, ensure_ascii=False, indent=2)