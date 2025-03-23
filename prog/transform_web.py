import os
import re

directory = "languages/en"
log_file = "transform_web.log"

# Thêm menu mới
new_menu = '''
    <nav>
        <ul>
            <li><a href="/languages/en/index.html">Home</a></li>
            <li><a href="/languages/en/persons">Persons</a></li>
            <li><a href="/languages/en/families">Families</a></li>
            <li><a href="/languages/en/charts">Charts</a></li>
            <li><a href="/languages/en/events">Events</a></li>
            <li><input type="text" id="search_input" placeholder="Search for Person..."></li>
            <li><button id="back_button" onclick="window.history.back();">⬅ Back</button></li>
        </ul>
    </nav>
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

                # Thay thế hoặc thêm menu vào file HTML
                content = re.sub(r"<nav>.*?</nav>", new_menu, content, flags=re.DOTALL)

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
