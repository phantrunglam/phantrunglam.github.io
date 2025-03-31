# 📢 Release Notes: Chart Viewer Feature

## 🚀 New Features

### 1️⃣ **Danh Sách Phả Đồ**

- Thêm menu item **"Phả đồ"** vào thanh điều hướng.
- Danh sách phả đồ được lấy từ file JSON `chart-list.json`.
- Cấu trúc JSON:

```json
[
  {
    "image_id": "4073961826170869593",
    "image_desc": "13.3 Phan Bá Khoát, con cháu",
    "image_path": "/resources/charts/chart_phan_ba_khoat_descendant"
  },
  {
    "image_id": "Chart_4073961826170869593",
    "image_desc": "13.3 Phan Bá Khoát, tổ tiên & con cháu",
    "image_path": "/resources/charts/pbk_descendants"
  },
  {
    "image_id": "Chart_4073961826170869593",
    "image_desc": "1 Phan Phúc Toàn, con cháu",
    "image_path": "/resources/charts/chart_phan_phuc_toan_descendant"
  }
]
```

### 2️⃣ **Xem Phả Đồ bằng Popup**

- Khi bấm vào một mục trong danh sách Phả đồ, cửa sổ popup sẽ mở ra hiển thị hình ảnh.
- Ảnh hiển thị có định dạng `.webp` với fallback về `.jpg` nếu không tìm thấy.
- Cấu trúc URL ảnh:
  - **Ưu tiên:** `<image_path>.webp`
  - **Fallback:** `<image_path>.jpg`

### 3️⃣ **Popup Viewer với các Chức Năng:**

✅ **Reset**: Đưa ảnh về kích thước mặc định.  
✅ **Zoom In**: Phóng to ảnh để xem chi tiết.  
✅ **Zoom Out**: Thu nhỏ ảnh.  
✅ **Close**: Đóng cửa sổ popup.

## 📌 Implementation Details

- **Popup mở bằng `window.open()`**, đảm bảo có thể đóng bằng `window.close()`.
- **CSS điều chỉnh để đảm bảo hiển thị hợp lý trên các màn hình.**
- **Thêm sự kiện click cho button Close để đóng popup khi cần.**

## 🛠 Next Steps

- **Tối ưu giao diện của Popup Viewer.**
- **Thêm tính năng kéo thả (drag) để di chuyển ảnh trong popup.**
- **Hỗ trợ tải xuống ảnh phả đồ.**

📅 **Ngày phát hành**: _(Điền ngày release thực tế)_  
👨‍💻 **Người thực hiện**: _(Điền tên bạn hoặc nhóm phát triển)_
