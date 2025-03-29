from bs4 import BeautifulSoup
import os

def update_html_files():
    html_dir = 'languages/ma'
    menu_js_path = '/scripts/menu.js'
    
    # Đảm bảo thư mục scripts tồn tại
    os.makedirs('scripts', exist_ok=True)
    
    # Duyệt qua tất cả file HTML
    for root, dirs, files in os.walk(html_dir):
        for filename in files:
            if filename.endswith('.html'):
                filepath = os.path.join(root, filename)
                
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        if filename == 'help.html':
                            continue  # Bỏ qua không xử lý file help.html

                        soup = BeautifulSoup(f, 'html.parser')
                    # Trong phần xử lý HTML
                        soup.head.insert(0, soup.new_tag('meta', name='viewport', content='width=device-width, initial-scale=1.0'))

                    # Tìm thẻ menu_id và thay thế bằng version rỗng
                    menu_div = soup.find('div', {'id': 'menu_id'})
                    if menu_div:
                        menu_div.clear()
                        menu_div['id'] = 'menu_id'  # Giữ nguyên ID
                    
                    # Thêm tham chiếu đến menu.js nếu chưa có
                    existing_scripts = [script.get('src', '') for script in soup.find_all('script')]
                    if menu_js_path not in existing_scripts:
                        new_script = soup.new_tag('script', src=menu_js_path)
                        if soup.head:
                            soup.head.append(new_script)
                        else:
                            # Nếu không có head, tạo mới và thêm vào
                            head = soup.new_tag('head')
                            soup.html.insert(0, head)
                            head.append(new_script)
                    
                    # Lưu file đã chỉnh sửa
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(str(soup))
                    
                    print(f'Đã cập nhật: {filepath}')
                
                except Exception as e:
                    print(f'Lỗi khi xử lý {filepath}: {str(e)}')

if __name__ == '__main__':
    update_html_files()