import os
import re
import json

# Thư mục chứa các file HTML của cá nhân
PERSONS_DIR = "languages/en/persons"

# Danh sách lưu trữ kết quả
persons_list = []

# Duyệt qua tất cả các file HTML trong thư mục persons
for file_name in os.listdir(PERSONS_DIR):
    if file_name.startswith("Person_") and file_name.endswith(".html"):
        file_path = os.path.join(PERSONS_DIR, file_name)
        print("Process file: ", file_path)

        # Đọc nội dung file HTML
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()

        # Tìm ID từ tên file (Person_xyz.html -> ID = xyz)
        # person_id = re.search(r"Person_(\d+)\.html", file_name)
        # person_id = person_id.group(1) if person_id else "0"
        match_id = re.search(r'Person_([A-Za-z0-9]+)', file_name)
        person_id = match_id.group(1) if match_id else "0"
        print("Person_id: " + person_id)


        # Tìm chuỗi nameTextLines
        # match = re.search(r'"nameTextLines": \[(.*?)\]', content, re.DOTALL)
        # Tìm chuỗi nameTextLines (có thể có khoảng trắng xung quanh `:` và `[`)
        match = re.search(r'"nameTextLines"\s*:\s*\[(.*?)\]', content, re.DOTALL)

        if match:
            # Lấy danh sách tên từ JSON-like format
            name_lines = match.group(1)

            # Tách từng phần tử trong mảng
            name_parts = re.findall(r'"(.*?)"', name_lines)

            # Ghép thành tên hoàn chỉnh
            full_name = " ".join(name_parts).strip()

            persons_list.append({"id": person_id, "name": full_name})

# Ghi danh sách vào file JSON
with open("persons_list.json", "w", encoding="utf-8") as json_file:
    json.dump(persons_list, json_file, ensure_ascii=False, indent=4)

print("✅ Danh sách cá nhân đã được lưu vào persons_list.json")
