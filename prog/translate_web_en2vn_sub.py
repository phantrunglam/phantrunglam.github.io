# -*- coding: utf-8 -*-
import os
import re
import shutil

'''
 This is a script to translate sub English to Vietnamese.
 Copy files to vn folder.
'''

# Danh sách từ khóa cần thay thế
translations = {
    ("Family", "Families"): "Gia đình",
    ("Father", "Fathers"): "Cha",
    "Mother": "Mẹ",
    ("Parents", "Parent"): "Cha Mẹ",
    "Spouse": "Vợ/Chồng",
    ("Person", "Persons"): "Nhân vật",
    "Children" : "Con cái",
    "Child" : "Con",
    "Focused Person Chart": "Nhân vật trung tâm",
    "Person Chart": "Phả hệ",
    "List of ": "Danh sách ",
    "Date of ": "Ngày ",
    ("Source", "Sources"): "Nguồn tham chiếu",
    "Statistics": "Thống kê",
    ("Partner", "Partners"): "Vợ/Chồng",
    "Name": "Tên",
    "Gender": "Giới tính",
    "Male": "Nam",
    "Female": "Nữ",
    "Birth": "Sinh",
    "Date of Birth": "Ngày sinh",
    "Place of Birth": "Nơi sinh",
    "Death": "Mất",
    "Date of Death": "Ngày mất",
    "Place of Death": "Nơi mất",
    "Genealogy": "Gia phả",
    "Family Tree": "Cây gia phả",
    "Home": "Trang chủ",
    "Search": "Tìm kiếm",
    "Edit": "Chỉnh sửa",
    "Delete": "Xóa",
    "Save": "Lưu",
    "Print": "In",
    "Export": "Xuất",
    ("Settings", "Setup"): "Cài đặt",
    "Login": "Đăng nhập",
    "Logout": "Đăng xuất",
    "Imprint": "Liên hệ",
    ("Events", "Event"): "Sự kiện",
    ("Facts", "Fact"): "Đặc điểm sinh học",
    "Statistic Charts": "Biểu đồ Thống kê",
    "Event Type" : "Loại Sự kiện",
    "Date" : "Ngày",
    "Place" : "Địa điểm",
    ("Descriptions", "Description") : "Mô tả",
    "Media" : "Media / Hình ảnh/Video/Audio",
    ("Pictures", "Picture"): "Hình ảnh",
    "Family Name" : "Tên Gia đình",
    "Man" : "Cha",
    "Woman" : "Mẹ",
    ("Notes", "Note") : "Ghi chú",
    ("Additional Names",  "Additional Name") : "Danh xưng/Tên khác",

    "Time & Dates": "Ngày & Thời gian",
    "Total Families" : "Tổng số Gia đình",
    "Married Families" : "Số gia đình chưa ly hôn",
    "Divorced Families" : "Số gia đình ly hôn",
    "Total Persons" : "Số Cá nhân",
    "Male persons" : "Số đàn ông",
    "Female persons" : "Số phụ nữ",
    "Persons with unknown gender" : "Giới tính không xác định",
    "Intersex persons" : "Đa giới tính",
    "Person Events" : "Sự kiện Nhân vật",
    "Family Events" : "Sự kiện Gia đình",
    "Earliest Date" : "Ngày sớm nhất",
    "Latest Date"   : "Ngày gần nhất",
    "Age at Death" : "Tuổi khi mất",
    "Age at Retirement" : "Tuổi nghỉ hưu",
    "Age at Marriage" : "Tuổi khi kết hôn",
    "Age at Divorce" : "Tuổi khi ly hôn",
    "Age of Parents at Birth of Child" : "Tuổi bố mẹ khi sinh con",
    "Age of Child at Parents Death" : "Tuổi con khi bố mẹ mất",
    "Age of Person at Death of Partner" : "Tuổi của Vợ/Chồng khi Chồng/Vợ mất",
    "Time between Marriage and Birth of Child" : "Thời gian giữa Kết hôn và Sinh con",
    "Last Name Distribution" : "Biểu đồ Phân phối theo Họ",
    "First Name Distribution" : "Biểu đồ Phân phối theo Tên",
    "Title Distribution" : "Biểu đồ phân phối theo Chức danh",
    "Year of Birth" : "Biểu đồ theo Năm sinh",
    "Year of Death" : "Biểu đồ theo năm mắt",
    "Year of Burial" : "Năm chôn cất",
    "Month of Birth" : "Biểu đồ ngày sinh theo Tháng",
    "Month of Death" : "Biểu đồ ngày mất theo Tháng",
    "Month of Marriage" : "Biểu đồ ngày Kết hôn theo Tháng",
    "Children per Family" : "Số con trong Gia đình",
    "Country of Birth" : "Thống kê Sinh theo Quốc gia",
    "Country of Death" : "Nơi mất theo Quốc gia",
    "Place of Marriage" : "Nơi Kết hôn theo địa phương",
    "Country of Marriage" : "Nơi Kết hôn theo Quốc gia",
    "Event or Fact Types" : "Loại Sự kiện hoặc Đặc điểm",
    "Webpage created with MacFamilyTree 10 for macOS" : "Quản trị viên: Phan Trung Lâm, @Copyright 2025 Phan Ngô Đại tộc",
    "Author Contact" : "Liên hệ Tác giả",
    "Synium Contact": "Ban đại diện Gia tộc",
    "Company" : "Gia tộc",
    "Synium Software GmbH Germany" : "Họ Phan Ngô Tống Văn",
    "www.syniumsoftware.com" : "https://www.blogger.com/blog/posts/3754450817356124571",
    "Mac App Store" : "Phiên bản",
    "MacFamilyTree 10": "Phát hành 1.0",
    "Entries assigned to this media" : "Hình ảnh được dùng với"

}

# Đường dẫn thư mục chứa các file gốc và đích
SRC_LANG = "languages/en"
DEST_LANG = "languages/vn"
LOG_FILE = "translation_log.txt"

# Chuỗi cần tìm và thay thế trong đường dẫn
old_string = "/languages/en/"
new_string = "/languages/vn/"
pattern = re.compile(re.escape(old_string))

# Sắp xếp danh sách thay thế theo độ dài giảm dần để đảm bảo cụm từ dài được dịch trước
sorted_translations = sorted(
    [(en, vi) for keys, vi in translations.items() for en in (keys if isinstance(keys, tuple) else [keys])],
    key=lambda x: -len(x[0])
)


def process_html(file_path, new_file_path):
    """Dịch nội dung file HTML và sửa đường dẫn"""
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()

        # Dịch nội dung
        changes = []
        for en, vi in sorted_translations:
            if " " in en:
                new_content, count = re.subn(re.escape(en), vi, content)
            else:
                new_content, count = re.subn(rf"\b{re.escape(en)}\b", vi, content)

            if count > 0:
                changes.append(f"{en} -> {vi} ({count} lần)")
            content = new_content

        # Sửa đường dẫn `languages/en/` thành `languages/vn/`
        content = pattern.sub(new_string, content)

        # Lưu file đã chỉnh sửa
        os.makedirs(os.path.dirname(new_file_path), exist_ok=True)
        with open(new_file_path, "w", encoding="utf-8") as file:
            file.write(content)

        # Ghi log nếu có thay đổi
        if changes:
            with open(LOG_FILE, "a", encoding="utf-8") as log:
                log.write(f"Translated: {file_path} -> {new_file_path}\n")
                for change in changes:
                    log.write(f"  {change}\n")
                log.write("\n")

        print(f"✅ Đã xử lý: {file_path} -> {new_file_path}")

    except Exception as e:
        print(f"❌ Lỗi khi xử lý {file_path}: {e}")


def process_all_files(src, dest):
    """Duyệt qua tất cả file HTML trong thư mục và xử lý"""
    if not os.path.exists(dest):
        shutil.copytree(src, dest)

    for root, _, files in os.walk(dest):
        for file in files:
            if file.endswith(".html"):
                src_path = os.path.join(root, file)
                dest_path = src_path.replace(src, dest, 1)
                process_html(src_path, dest_path)


def modify_index_html(index_path):
    """Chỉnh sửa index.html để có menu chọn ngôn ngữ"""
    try:
        with open(index_path, "r", encoding="utf-8") as file:
            content = file.read()

        # Thêm menu chọn ngôn ngữ nếu chưa có
        language_menu = '''
        <div id="language-switch">
            <a href="javascript:setLanguage('en');">English</a> | 
            <a href="javascript:setLanguage('vn');">Tiếng Việt</a>
        </div>
        '''

        if "id=\"language-switch\"" not in content:
            content = content.replace("<body>", f"<body>\n{language_menu}")

            with open(index_path, "w", encoding="utf-8") as file:
                file.write(content)

            print("✅ Đã cập nhật index.html với menu chọn ngôn ngữ.")

    except Exception as e:
        print(f"❌ Lỗi khi chỉnh sửa index.html: {e}")


# Chạy chương trình
modify_index_html("index.html")
modify_index_html(SRC_LANG+"/index.html")
process_all_files(SRC_LANG, DEST_LANG)


print("🎉 Hoàn tất xử lý trang web!")
