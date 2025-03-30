import os
import re
from pathlib import Path

def convert_relative_paths(root_folder):
    # Duyệt qua tất cả file HTML
    for foldername, subfolders, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename.endswith('.html'):
                filepath = os.path.join(foldername, filename)
                process_file(filepath)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content = content
    
    # 1. Xử lý tất cả đường dẫn tương đối (../ hoặc nhiều hơn)
    new_content = re.sub(
        r'(href|src)="((?:\.\./)+)([^"]+)"',
        lambda m: f'{m.group(1)}="/{m.group(3)}"',
        new_content
    )
    
    # 2. Đặc biệt xử lý chuyển đổi en -> vn trong đường dẫn ngôn ngữ
    new_content = re.sub(
        r'(href|src)="/languages/en/([^"]+)"',
        lambda m: f'{m.group(1)}="/languages/vn/{m.group(2)}"',
        new_content
    )
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f'Đã cập nhật: {filepath}')

if __name__ == '__main__':
    # Thay đổi đường dẫn này thành thư mục gốc của project
    project_root = 'languages/vn'
    convert_relative_paths(project_root)

