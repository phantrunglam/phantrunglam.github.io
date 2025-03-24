import json
import os
import re

BASE_DIR = "languages/en/persons"
PERSON_LIST_FILE = "scripts/person_list.json"

def extract_person_data(file_path):
    person_id = os.path.splitext(os.path.basename(file_path))[0].replace("Person_", "")

    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()

    # match = re.search(r'personChartData = (\[.*?]);', content, re.DOTALL)
    # if not match:
    #     return None

     # Tìm nameTextLines
    name_match = re.search(r'"nameTextLines"\s*:\s*\[(.*?)\]', content, re.DOTALL)
    person_name = name_match.group(1).strip('"') if name_match else ""
    #
    # Tìm dateTextLines (ngày sinh)
    birthday_match = re.search(r'"dateTextLines"\s*:\s*\[(.*?)\]', content, re.DOTALL)
    person_birthday = birthday_match.group(1).strip('"') if birthday_match else ""
    #
    # # Tìm personGender
    gender_match = re.search(r'"personGender"\s*:\s*(\d+)', content)
    person_gender = int(gender_match.group(1)) if gender_match else -1

    if person_name:
        return {
            "person_id": person_id,
            "person_name": person_name,
            "person_birthday": person_birthday,
            "person_link": os.path.basename(file_path),
            "person_gender": person_gender
        }

    return None


    # try:
    #     person_data = json.loads(match.group(1))
    #     print(person_data)
    #     for person in person_data:
    #         if person.get("currentPerson", True):
    #             return {
    #                 "person_id": person_id,
    #                 "person_name": person.get("nameTextLines", [""])[0],
    #                 "person_birthday": person.get("dateTextLines", [""])[0],
    #                 "person_link": os.path.basename(file_path),
    #                 "person_gender": person.get("personGender", -1)
    #             }
    # except json.JSONDecodeError:
    #     return None

    return None

def generate_person_list():
    person_list = []
    print(f"Scanning directory: {BASE_DIR}")

    for file_name in os.listdir(BASE_DIR):
        if file_name.startswith("Person_") and file_name.endswith(".html"):
            file_path = os.path.join(BASE_DIR, file_name)
            print(f"Processing: {file_path}")  # In ra tên file đang xử lý

            person_data = extract_person_data(file_path)
            if person_data:
                person_list.append(person_data)

    os.makedirs(os.path.dirname(PERSON_LIST_FILE), exist_ok=True)
    with open(PERSON_LIST_FILE, "w", encoding="utf-8") as json_file:
        json.dump(person_list, json_file, indent=4, ensure_ascii=False)

    print(f"Generated {PERSON_LIST_FILE} with {len(person_list)} persons.")

if __name__ == "__main__":
    generate_person_list()
