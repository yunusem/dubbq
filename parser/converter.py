import json
import re

def parse_md_to_json(md_filename):
    verses = {}
    current_verse = None

    with open(md_filename, 'r', encoding='utf-8') as file:
        for line in file:
            if line.startswith('#'):
                # Extract verse number
                current_verse = re.findall(r'\d+', line)[0]
            elif line.strip():
                # Assuming the next line after the verse number is the verse text
                verses[current_verse] = line.strip()

    return verses

# Parse the markdown file
verses = parse_md_to_json('imlaei-simple-qurancom.md')

# Write to a JSON file
with open('imlaei-qurancom.json', 'w', encoding='utf-8') as file:
    json.dump(verses, file, ensure_ascii=False, indent=4)

print("JSON file created successfully.")
