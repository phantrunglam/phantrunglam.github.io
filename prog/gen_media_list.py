import os
import json
import re
from bs4 import BeautifulSoup

BASE_DIR = "languages/en/persons"
MEDIA_LIST_FILE = "scripts/media_list.json"
PERSON_LIST_FILE = "scripts/person_list.json"

def extract_media_data(file_path, person_id):
    print(f"Processing file: {file_path}")
    with open(file_path, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")

    media_list = []
    media_sections = soup.find_all("div", class_="media_div")
    if media_sections:
        print(f"Found media sections in {file_path}")
        for media_div in media_sections:
            img_tag = media_div.find("img")
            media_text = media_div.find("p")
            if img_tag:
                media_src = img_tag.get("src", "").replace("../../../resources/", "")
                media_realname = media_text.text.strip() if media_text else "Unknown"

                # Xác định media_id
                media_id_match = re.search(r'Media_O(\d+)', media_src)
                if media_id_match:
                    media_id = media_id_match.group(1)

                    # Nếu là thumbnail, chuyển về media gốc
                    if "_Thumbnail" in media_src:
                        media_path = media_src.replace("_Thumbnail", "")
                        media_thumbnail = media_src
                    else:
                        media_path = media_src
                        media_thumbnail = media_src.replace(".jpeg", "_Thumbnail.jpeg")

                    print(f"Extracted Media: ID={media_id}, Name={media_realname}, Path={media_path}, Thumbnail={media_thumbnail}")

                    media_list.append(media_id)
                    update_media_list(media_id, media_realname, media_path, media_thumbnail, person_id)
    else:
        print(f"No media sections found in {file_path}")

    return media_list

def update_media_list(media_id, media_realname, media_path, media_thumbnail, person_id):
    if os.path.exists(MEDIA_LIST_FILE):
        with open(MEDIA_LIST_FILE, "r", encoding="utf-8") as file:
            try:
                media_data = json.load(file)
                if not isinstance(media_data, list):
                    media_data = []
            except json.JSONDecodeError:
                media_data = []
    else:
        media_data = []

    print(f"Checking media entry for ID: {media_id}")

    media_entry = next((m for m in media_data if m.get("media_id") == media_id), None)
    if media_entry:
        if person_id not in media_entry["linked_persons"]:
            media_entry["linked_persons"].append(person_id)
    else:
        print(f"Adding new media entry: {media_id}")
        media_data.append({
            "media_id": media_id,
            "media_name": media_realname,
            "media_path": f"resources/{media_path}",
            "media_thumbnail": f"resources/{media_thumbnail}",
            "linked_persons": [person_id]
        })

    with open(MEDIA_LIST_FILE, "w", encoding="utf-8") as file:
        json.dump(media_data, file, indent=4, ensure_ascii=False)

def generate_media_list():
    if not os.path.exists(PERSON_LIST_FILE):
        print(f"Error: {PERSON_LIST_FILE} not found. Run person list generation first.")
        return

    with open(PERSON_LIST_FILE, "r", encoding="utf-8") as file:
        person_list = json.load(file)

    for person in person_list:
        person_id = person["person_id"]
        person_file = os.path.join(BASE_DIR, f"Person_{person_id}.html")
        if os.path.exists(person_file):
            print(f"Extracting media for person: {person_id}")
            person["person_media"] = extract_media_data(person_file, person_id)
        else:
            print(f"Person file not found: {person_file}")

    with open(PERSON_LIST_FILE, "w", encoding="utf-8") as file:
        json.dump(person_list, file, indent=4, ensure_ascii=False)

    print(f"Updated {PERSON_LIST_FILE} with media references.")
    print(f"Generated {MEDIA_LIST_FILE} with media assignments.")

if __name__ == "__main__":
    generate_media_list()
