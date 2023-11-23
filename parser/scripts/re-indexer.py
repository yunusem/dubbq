import json

def reindex_json(json_filename):
    with open(json_filename, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Re-indexing
    new_data = {str(i+1): verse for i, verse in enumerate(data.values())}

    with open('files/processed/reindexed_' + json_filename, 'w', encoding='utf-8') as file:
        json.dump(new_data, file, ensure_ascii=False, indent=4)

    print("Re-indexed JSON file created successfully.")

# Example usage
reindex_json('files/original/imlaei-qurancom.json')