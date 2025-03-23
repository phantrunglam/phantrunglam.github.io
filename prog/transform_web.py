import os
import re
import json

directory = "languages/en"
log_file = "transform_web.log"

person_media_file = "scripts/person_list.json"
media_list_file = "scripts/media_list.json"

# Menu mới cần thay thế
new_menu = '''
    <div id="menu_id">
    <ul id="menu_row_id">
        <li class="menu_item active_menu_item">
            <a href="/languages/vn/index.html">Home</a>
        </li>
        <li class="menu_item">
            <a href="/languages/vn/personlist.html">Person</a>
        </li>
        <li class="menu_item">
            <a href="/languages/vn/familylist.html">Family</a>
        </li>
        <li class="menu_item">
            <a href="/languages/vn/sourcelist.html">Sources</a>
        </li>
        <li class="menu_item">
            <a href="/languages/vn/statistics.html">Statistics</a>
        </li>
        <li class="menu_item">
            <a href="/languages/vn/contact.html">Contact</a>
        </li>
        <li><button id="back_button" onclick="window.history.back();">⬅ Back</button></li>
        <li class="menu_item search_item">
            <input type="text" id="search_input" placeholder="Search Person...">
            <div class="search-dropdown"></div>
        </li>
    </ul>
</div>
'''

# Thêm scripts vào <head>
new_scripts = '''
    <script src="/scripts/search_person.js"></script>
    <script src="/scripts/back_button.js"></script>
'''

def generate_media_gallery(person_id, person_media):
    media_html = '<div id="media_gallery" class="gallery-container">'
    for media_id in person_media:
        media_html += f'<img src="/resources/Media_{media_id}_Thumbnail.jpeg" class="gallery-image" data-id="{media_id}" onclick="openLightbox(this)">'
    media_html += '</div>'

    # Lightbox container
    media_html += '''
    <div id="lightbox" class="lightbox" style="display: none;">
        <button id="prevMedia">❮</button>
        <img id="lightboxImage" src="" alt="">
        <button id="nextMedia">❯</button>
        <span id="closeLightbox">&times;</span>
    </div>
    '''
    return media_html
def log_message(message):
    with open(log_file, "a", encoding="utf-8") as log:
        log.write(message + "\n")
    print(message)

def load_json(file_path):
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def update_html_files():
    log_message("Starting HTML file updates...")
    # data = load_json(person_media_file)
    # # print(person_list)
    # if isinstance(data, list):
    #     person_list = {p["person_id"]: p for p in data}  # Chuyển list thành dictionary
    # else:
    #     person_list = data
    # # log_message(f"Type of person_list: {type(person_list)}")


    for root, _, files in os.walk(directory):
        for file in files:
            # if file.startswith("Person_") and file.endswith(".html"):
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                # person_id = file.split("_")[1].replace(".html", "")
                # print("person_id:", person_id)

                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                original_content = content

                # Xóa toàn bộ đoạn từ <div id="separator"></div> đến <div id="separator"></div> và thay bằng new_menu
                content = re.sub(r'<div id="separator"></div>.*?<div id="separator"></div>', new_menu, content, flags=re.DOTALL)

                # Kiểm tra nếu chưa có scripts thì thêm vào ngay trước </head>
                if "search_person.js" not in content:
                    content = re.sub(r"</head>", new_scripts + "\n</head>", content, flags=re.DOTALL)

                # Thay thế media section với Media Gallery nếu có media liên kết với person_id
                # Đoạn này quá phức tạp. Tạm thời chưa thay thế.

                if content != original_content:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(content)
                    log_message(f"Updated: {file_path}")
                else:
                    log_message(f"No changes needed: {file_path}")
    log_message("HTML file updates completed.")

if __name__ == "__main__":
    update_html_files()
