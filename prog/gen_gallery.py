from bs4 import BeautifulSoup
import os

def convert_html_media_section(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")

    # Tìm phần media cũ
    media_section = soup.find("div", {"id": "media_subsection_id"})
    if not media_section:
        print(f"No media section found in {file_path}")
        return

    # Lấy danh sách ảnh
    image_divs = media_section.find_all("div", class_="media_div")
    images = [
        {
            "src": div.find("img")["src"],
            "alt": div.find("p").text if div.find("p") else "Image"
        }
        for div in image_divs
    ]

    # Tạo HTML mới cho gallery
    gallery_html = BeautifulSoup("", "html.parser")

    gallery_container = gallery_html.new_tag("div", **{"class": "gallery-container"})

    prev_button = gallery_html.new_tag("button", **{"class": "gallery-prev"})
    prev_button.string = "❮"
    gallery_container.append(prev_button)

    for image in images:
        slide = gallery_html.new_tag("div", **{"class": "gallery-slide"})
        img_tag = gallery_html.new_tag("img", src=image["src"], alt=image["alt"])
        slide.append(img_tag)
        gallery_container.append(slide)

    next_button = gallery_html.new_tag("button", **{"class": "gallery-next"})
    next_button.string = "❯"
    gallery_container.append(next_button)

    media_section.clear()
    media_section.append(gallery_container)

    # Thêm thumbnails
    thumbnail_container = gallery_html.new_tag("div", **{"class": "gallery-thumbnails"})
    for image in images:
        thumb_tag = gallery_html.new_tag("img", **{"class": "gallery-thumbnail", "src": image["src"], "alt": image["alt"]})
        thumbnail_container.append(thumb_tag)

    media_section.append(thumbnail_container)

    # Thêm script mới
    script_tag = gallery_html.new_tag("script", src="../../../scripts/gallery_script.js")
    media_section.append(script_tag)

    # Ghi đè file HTML
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(str(soup))

# Chạy trên tất cả các file HTML trong thư mục
html_folder = "test"
for filename in os.listdir(html_folder):
    if filename.startswith("Person_") and filename.endswith(".html"):
        convert_html_media_section(os.path.join(html_folder, filename))
