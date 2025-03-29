from bs4 import BeautifulSoup
import os

def update_html_files():
    html_dir = 'languages/vn'  # Đã sửa từ 'ma' thành 'vn' theo đường dẫn lỗi
    required_scripts = [
        '/scripts/back_button.js',
        '/scripts/menu.js',
        '/scripts/search_person.js'
    ]
    
    os.makedirs('scripts', exist_ok=True)
    
    for root, dirs, files in os.walk(html_dir):
        for filename in files:
            if filename.endswith('.html'):
                filepath = os.path.join(root, filename)
                
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        if filename == 'help.html':
                            continue

                        soup = BeautifulSoup(f, 'html.parser')
                        
                        # 1. Xử lý head
                        if not soup.head:
                            head = soup.new_tag('head')
                            soup.html.insert(0, head)
                        
                        # 2. Thêm meta tags (sửa chỗ này)
                        if not soup.find('meta', {'charset': True}):
                            meta_charset = soup.new_tag('meta')
                            meta_charset['charset'] = 'utf-8'
                            soup.head.insert(0, meta_charset)
                        
                        if not soup.find('meta', {'name': 'viewport'}):
                            meta_viewport = soup.new_tag('meta')
                            meta_viewport['name'] = 'viewport'
                            meta_viewport['content'] = 'width=device-width, initial-scale=1.0'
                            soup.head.insert(1, meta_viewport)
                        
                        # 3. Xử lý title
                        if not soup.title:
                            title = soup.new_tag('title')
                            title.string = 'Phan Ngô gia phả'
                            soup.head.append(title)
                        
                        # 4. Xử lý menu_id
                        menu_div = soup.find('div', {'id': 'menu_id'})
                        if menu_div:
                            menu_div.clear()
                            menu_div['id'] = 'menu_id'
                        
                        # 5. Xử lý scripts
                        for script in soup.find_all('script'):
                            if script.get('src') in required_scripts:
                                script.decompose()
                        
                        for script_src in required_scripts:
                            new_script = soup.new_tag('script', src=script_src)
                            soup.head.append(new_script)
                        
                        # 6. CSS và favicon
                        if not soup.find('link', {'href': '../../css/default.css'}):
                            css_link = soup.new_tag('link',
                                rel='stylesheet',
                                href='../../css/default.css',
                                type='text/css'
                            )
                            soup.head.append(css_link)
                        
                        if not soup.find('link', {'rel': 'icon'}):
                            favicon_link = soup.new_tag('link',
                                rel='icon',
                                href='/favicon.ico',
                                type='image/x-icon'
                            )
                            soup.head.append(favicon_link)
                        
                        # 7. Xử lý body
                        if not soup.body:
                            body = soup.new_tag('body')
                            soup.html.append(body)
                        
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(str(soup))
                        
                        print(f'Đã cập nhật: {filepath}')
                
                except Exception as e:
                    print(f'Lỗi khi xử lý {filepath}: {str(e)}')

if __name__ == '__main__':
    update_html_files()