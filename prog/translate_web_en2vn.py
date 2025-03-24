# -*- coding: utf-8 -*-
import os
import re
import shutil
import json

'''
  This is a script to translate sub English to Vietnamese.
  Keep files in place.
'''

# Danh sách từ khóa cần thay thế

# Đường dẫn file từ điển dịch
DICT_FILE = "scripts/en_vn_dictionary.json"
# Đường dẫn thư mục nguồn và đích
SRC_LANG = "languages/en"
DEST_LANG = "languages/vn"
LOG_FILE = "translation_log.txt"


# Chuỗi cần tìm và thay thế trong đường dẫn
old_string = "/languages/en/"
new_string = "/languages/vn/"
pattern = re.compile(re.escape(old_string))

# # Sắp xếp danh sách thay thế theo độ dài giảm dần để đảm bảo cụm từ dài được dịch trước
# sorted_translations = sorted(
#     [(en, vi) for keys, vi in translations.items() for en in (keys if isinstance(keys, tuple) else [keys])],
#     key=lambda x: -len(x[0])
# )

def load_dictionary():
    with open(DICT_FILE, "r", encoding="utf-8") as f:
        dictionary = json.load(f)

    # Sắp xếp các key theo độ dài giảm dần để đảm bảo cụm từ dài được dịch trước
    sorted_dict = dict(sorted(dictionary.items(), key=lambda item: len(item[0]), reverse=True))
    return sorted_dict

# Thay thế nội dung dựa trên từ điển
def translate_content(content, dictionary):
    changes = []
    for en, vi in dictionary.items():
        new_content, count = re.subn(rf"\b{re.escape(en)}\b", vi, content)
        if count > 0:
            changes.append(f"{en} -> {vi} ({count} lần)")
        content = new_content
    return content, changes



# Xử lý file HTML
def process_html(file_path, new_file_path, dictionary):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()

        translated_content, changes = translate_content(content, dictionary)

        os.makedirs(os.path.dirname(new_file_path), exist_ok=True)
        with open(new_file_path, "w", encoding="utf-8") as file:
            file.write(translated_content)

        if changes:
            with open(LOG_FILE, "a", encoding="utf-8") as log:
                log.write(f"Translated: {file_path} -> {new_file_path}\n")
                for change in changes:
                    log.write(f"  {change}\n")
                log.write("\n")
        print(f"✅ Đã xử lý: {file_path} -> {new_file_path}")
    except Exception as e:
        print(f"❌ Lỗi khi xử lý {file_path}: {e}")


# Xử lý toàn bộ file HTML
def process_all_files():
    dictionary = load_dictionary()
    if not os.path.exists(DEST_LANG):
        shutil.copytree(SRC_LANG, DEST_LANG)
    for root, _, files in os.walk(DEST_LANG):
        for file in files:
            if file.endswith(".html"):
                src_path = os.path.join(root, file)
                dest_path = src_path.replace(SRC_LANG, SRC_LANG, 1)
                process_html(src_path, dest_path, dictionary)




process_all_files()
print("🎉 Hoàn tất xử lý trang web!")
