import os
import re

directory = "languages/en"
log_file = "transform_web.log"

# Menu mới cần thay thế
new_menu = '''
    <div id="menu_id">
    <ul id="menu_row_id">
        <li class="menu_item active_menu_item">
            <a href="/languages/en/index.html">Home</a>
        </li>
        <li class="menu_item">
            <a href="/languages/en/personlist.html">Person</a>
        </li>
        <li class="menu_item">
            <a href="/languages/en/familylist.html">Family</a>
        </li>
        <li class="menu_item">
            <a href="/languages/en/sourcelist.html">Sources</a>
        </li>
        <li class="menu_item">
            <a href="/languages/en/statistics.html">Statistics</a>
        </li>
        <li class="menu_item">
            <a href="/languages/en/contact.html">Contact</a>
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

def log_message(message):
    with open(log_file, "a", encoding="utf-8") as log:
        log.write(message + "\n")
    print(message)

def update_html_files():
    log_message("Starting HTML file updates...")
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                original_content = content

                # Xóa toàn bộ đoạn từ <div id="separator"></div> đến <div id="separator"></div> và thay bằng new_menu
                content = re.sub(r'<div id="separator"></div>.*?<div id="separator"></div>', new_menu, content, flags=re.DOTALL)

                # Kiểm tra nếu chưa có scripts thì thêm vào ngay trước </head>
                if "search_person.js" not in content:
                    content = re.sub(r"</head>", new_scripts + "\n</head>", content, flags=re.DOTALL)

                if content != original_content:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(content)
                    log_message(f"Updated: {file_path}")
                else:
                    log_message(f"No changes needed: {file_path}")
    log_message("HTML file updates completed.")

if __name__ == "__main__":
    update_html_files()
