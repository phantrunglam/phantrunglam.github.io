# Hệ Thống Trang Web Gia Phả

## 1. **Tổng quan hệ thống**

- **Repository**: Lưu trữ trên GitHub.
- **Hosting**: Netlify (trang web tĩnh, kết nối với GitHub).
- **Công nghệ**: HTML, JavaScript (không có backend riêng).

## 2. **Hiện trạng**

### a. Kích thước hệ thống

- **Dự kiến lưu trữ**: Khoảng 2000 nhân vật.
- **File `person_list.json`**: Lưu danh sách nhân vật, kích thước không lớn.
- **File `users.json`**: Dự kiến lưu thông tin người dùng: `id`, `name`, `roles`, `effective date`, `last signon`, v.v.

### b. Đăng ký/Đăng nhập

- Sử dụng tính năng Authentication của Netlify.
- Hiện chưa triển khai.

### c. Gửi góp ý

- Dữ liệu có thể lưu dưới dạng JSON trên Netlify.
- Chưa có cơ chế hiển thị hoặc quản lý.

### d. Gửi ảnh

- Người dùng có thể tải ảnh lên Cloudinary.
- Quá trình upload đã hoạt động.
- Chưa hoàn thiện liên kết ảnh với nhân vật.

## 3. **Đề xuất thiết kế**

### a. Đăng ký/Đăng nhập

#### Lựa chọn phương án:

1. **Sử dụng Netlify Identity**:

   - Quản lý tài khoản thông qua Netlify.
   - Hỗ trợ xác thực bằng email/password hoặc OAuth (Google, GitHub).
   - Không cần tự xây dựng hệ thống backend.
   - Hạn chế: Dữ liệu người dùng lưu trên Netlify, khó tùy chỉnh roles.

2. **Tự quản lý đăng ký/đăng nhập**:
   - Lưu thông tin người dùng trong `users.json`.
   - Có toàn quyền kiểm soát dữ liệu, dễ quản lý roles và quyền hạn.
   - Cần xây dựng xác thực bằng JavaScript hoặc Netlify Functions.

**Đề xuất**: Nếu chỉ cần xác thực đơn giản, nên dùng **Netlify Identity** để giảm tải quản lý. Nếu cần quản lý roles linh hoạt hơn, có thể tự xây dựng hệ thống.

### b. Gửi góp ý

- Tạo biểu mẫu gửi góp ý (`feedback.html`).
- Gửi dữ liệu qua Netlify Functions để lưu vào JSON.
- Hiển thị danh sách góp ý trên trang quản lý.

### c. Gửi ảnh và liên kết với nhân vật

- Khi upload ảnh lên Cloudinary, lưu lại thông tin ảnh vào JSON (hoặc Netlify Functions).
- Thêm tính năng chọn nhân vật khi tải ảnh lên.
- Cập nhật `person_list.json` hoặc tạo `media_list.json` để lưu thông tin liên kết ảnh với nhân vật.

## 4. **Các bước tiếp theo**

✅ Cấu hình Netlify Identity hoặc xây dựng hệ thống tự quản lý.  
✅ Xây dựng giao diện đăng nhập/đăng ký.  
✅ Tạo Netlify Function để lưu góp ý và ảnh.  
✅ Hoàn thiện cơ chế liên kết ảnh với nhân vật.  
✅ Hiển thị danh sách góp ý và ảnh trong giao diện web.

---

**Ghi chú**: Việc lưu trữ dữ liệu JSON có thể giới hạn khi số lượng dữ liệu lớn, cần xem xét giải pháp mở rộng sau này.

## Cấu hình Netlify

### 1. Bật Netlify Identity

Truy cập Netlify → Mở Settings của trang web.

Chọn Identity → Enable Identity.

Trong phần Registration, chọn Invite only (nếu muốn admin duyệt user) hoặc Open (cho phép user tự đăng ký).

Trong OAuth providers, bật Google/GitHub nếu cần.

### 2. Thêm Netlify Identity vào trang web

Chèn đoạn script sau vào <head> của index.html và các trang liên quan:

html

<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>

### 3. Hiển thị menu theo trạng thái đăng nhập

Thêm đoạn code vào menu.js (hoặc script trong <head>):
document.addEventListener("DOMContentLoaded", function () {
const user = netlifyIdentity.currentUser();
updateMenu(user);

    netlifyIdentity.on("login", (user) => {
        updateMenu(user);
        window.location.reload();
    });

    netlifyIdentity.on("logout", () => {
        updateMenu(null);
        window.location.reload();
    });

    function updateMenu(user) {
        const menu = document.getElementById("menu");
        if (!menu) return;

        if (user) {
            const roles = user.app_metadata.roles || [];
            menu.innerHTML = roles.includes("admin")
                ? `<a href="/">Home</a> | <a href="/feedback.html">Feedback</a> | <a href="#" onclick="netlifyIdentity.logout()">Logout</a>`
                : `<a href="/">Home</a> | <a href="/upload.html">Upload Image</a> | <a href="#" onclick="netlifyIdentity.logout()">Logout</a>`;
        } else {
            menu.innerHTML = `<a href="/help.html">Help</a> | <a href="#" onclick="netlifyIdentity.open()">Sign up / Login</a>`;
        }
    }

});

### 4. Thiết lập phân quyền (normal user vs admin)

Trong Netlify Identity → Users, chỉnh Metadata của user để thêm "roles": ["admin"] hoặc "roles": ["user"].

Kiểm tra quyền trong code:
netlifyIdentity.on("login", (user) => {
const roles = user.app_metadata.roles || [];
if (roles.includes("admin")) {
window.location.href = "/admin.html";
} else {
window.location.href = "/home.html";
}
});

### 5. Gửi ảnh với currentPerson = true

Trong trang upload.html:
const uploadImage = (file) => {
const user = netlifyIdentity.currentUser();
if (!user) return alert("Bạn cần đăng nhập!");

    const currentPerson = getCurrentPersonId(); // Hàm lấy person đang xem
    const data = new FormData();
    data.append("file", file);
    data.append("person_id", currentPerson);

    fetch("/.netlify/functions/upload", {
        method: "POST",
        body: data,
        headers: { Authorization: `Bearer ${user.token.access_token}` }
    }).then((res) => res.json()).then((data) => {
        alert("Ảnh đã được gửi thành công!");
    });

};

### 6. Hiển thị feedback và ảnh cho admin

Trong admin.html:

const user = netlifyIdentity.currentUser();
if (!user || !user.app_metadata.roles.includes("admin")) {
alert("Bạn không có quyền truy cập!");
window.location.href = "/";
}

// Fetch feedback & images
fetch("/.netlify/functions/get_feedback", {
headers: { Authorization: `Bearer ${user.token.access_token}` }
})
.then((res) => res.json())
.then((data) => {
document.getElementById("feedbackList").innerHTML = data.map(f => `<p>${f.message}</p>`).join("");
});

## Phân tích và đề xuất giải pháp thay thế Netlify Identity

### 1. Vấn đề với Netlify Identity

Netlify Identity đã bị deprecate và không còn được hỗ trợ.

Các tính năng hiện tại vẫn hoạt động nhưng có thể không an toàn hoặc không được cập nhật trong tương lai.

Không thể mở rộng hoặc sửa đổi nhiều nếu cần thay đổi sau này.

### 2. Lựa chọn thay thế

A. Dùng OAuth (Google, GitHub, Facebook, v.v.)
✅ Ưu điểm:

Không cần nhớ mật khẩu, chỉ đăng nhập bằng tài khoản có sẵn.

Bảo mật cao, không cần quản lý mật khẩu.

Triển khai dễ dàng với các dịch vụ như Auth0, Firebase Authentication, Netlify OAuth, v.v.

❌ Nhược điểm:

Một số thành viên gia đình có thể không hiểu OAuth hoặc không có tài khoản Google/GitHub.

Yêu cầu thêm thiết lập cho OAuth provider.

B. Xây dựng hệ thống đăng nhập đơn giản (Email + Link đăng nhập)
✅ Ưu điểm:

Người dùng chỉ nhập email, nhận link đăng nhập trong hộp thư.

Không cần nhớ mật khẩu, phù hợp với người dùng không rành công nghệ.

Có thể sử dụng Magic Link Authentication (như Firebase, Supabase).

❌ Nhược điểm:

Cần có email để nhận link đăng nhập.

Phụ thuộc vào dịch vụ backend như Firebase Authentication, Supabase Auth.

C. Sử dụng Firebase Authentication (Email/Password)
✅ Ưu điểm:

Hỗ trợ đăng nhập bằng email/password.

Có thể mở rộng thêm OAuth sau này nếu cần.

Firebase miễn phí với quy mô nhỏ.

❌ Nhược điểm:

Cần tích hợp Firebase SDK vào trang web.

Người dùng cần nhớ mật khẩu.

## 3. Đề xuất phương án

Vì người dùng là thành viên gia đình, có email nhưng không rành công nghệ, phương án B (Magic Link Authentication) hoặc C (Firebase Authentication) là phù hợp nhất.

🔥 Giải pháp đề xuất: Firebase Authentication với Email/Password
Đơn giản hơn OAuth, không cần tài khoản Google/GitHub.

Người dùng có thể tự đăng ký bằng email, không cần hướng dẫn phức tạp.

Firebase miễn phí cho số lượng user nhỏ (~2000 thành viên vẫn ổn).

Dễ dàng mở rộng (thêm OAuth sau này nếu muốn).

## 4. Các bước triển khai

### 4.2 Đăng ký Firebase: Firebase Console

Bật Authentication → Chọn Email/Password.

### 4.3 Thêm Firebase SDK vào trang web:

<script src="https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js"></script>

### 4.4 Cấu hình Firebase trong auth.js:

const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_PROJECT.firebaseapp.com",
};
firebase.initializeApp(firebaseConfig);

### 4.5 Thêm form đăng nhập:

<input type="email" id="email" placeholder="Nhập email">
<input type="password" id="password" placeholder="Nhập mật khẩu">
<button onclick="signIn()">Đăng nhập</button>

### 4.6 Xử lý đăng nhập trong auth.js:

function signIn() {
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
firebase.auth().signInWithEmailAndPassword(email, password)
.then(userCredential => {
console.log("Đăng nhập thành công!", userCredential.user);
})
.catch(error => {
console.error("Lỗi đăng nhập:", error.message);
});
}

## 5. Kết luận

🚀 Sử dụng Firebase Authentication với Email/Password là giải pháp tối ưu:

Phù hợp với người dùng ít rành công nghệ.

Không phụ thuộc vào Netlify Identity.

Có thể mở rộng OAuth sau này nếu cần.

Firebase Project

Project name
phanngo
Project ID
phanngo-824a4
Project number
814664539738
Web API Key
AIzaSyBqrofn0JbDu56BxcbyNv_zNdzVp0boxOk

Firebase

<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBqrofn0JbDu56BxcbyNv_zNdzVp0boxOk",
    authDomain: "phanngo-824a4.firebaseapp.com",
    projectId: "phanngo-824a4",
    storageBucket: "phanngo-824a4.firebasestorage.app",
    messagingSenderId: "814664539738",
    appId: "1:814664539738:web:f62d6e48d04123b7600263",
    measurementId: "G-9KHGY2S4EY"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
