// Hỗ trợ cả email.password và Google authentication
document.addEventListener("DOMContentLoaded", function () {
  if (!window.netlifyIdentity) return;

  const googleLoginBtn = document.getElementById("google-login-btn");
  const emailLoginForm = document.getElementById("email-login-form");
  const logoutBtn = document.getElementById("logout-btn");
  const userInfo = document.getElementById("user-info");

  // Cập nhật giao diện người dùng
  function updateUI(user) {
    if (user) {
      userInfo.innerText = `Xin chào, ${
        user.user_metadata.full_name || user.email
      }!`;
      googleLoginBtn.style.display = "none";
      emailLoginForm.style.display = "none";
      logoutBtn.style.display = "block";
      // 🔹 Chuyển hướng sau khi đăng nhập thành công
      setTimeout(() => {
        window.location.href = "/langauges/vn/index.html"; // Thay bằng trang chính sau khi đăng nhập
      }, 1000);
    } else {
      userInfo.innerText = "";
      googleLoginBtn.style.display = "block";
      emailLoginForm.style.display = "block";
      logoutBtn.style.display = "none";
    }
  }

  // Kiểm tra trạng thái đăng nhập khi tải trang
  netlifyIdentity.on("init", (user) => {
    updateUI(user);
  });

  // Đăng nhập bằng Google/GitHub
  googleLoginBtn.addEventListener("click", () => {
    netlifyIdentity.open();
  });

  // Đăng nhập bằng email/password
  emailLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await netlifyIdentity.login(email, password);
    } catch (error) {
      alert("Lỗi đăng nhập: " + error.message);
    }
  });

  // Đăng xuất
  logoutBtn.addEventListener("click", () => {
    netlifyIdentity.logout();
  });

  netlifyIdentity.on("login", (user) => {
    updateUI(user);
    console.log("User logged in:", user);
  });

  netlifyIdentity.on("logout", () => {
    updateUI(null);
    console.log("User logged out");
    // 🔹 Chuyển hướng sau khi đăng xuất
    setTimeout(() => {
      window.location.href = "/index.html"; // Thay bằng trang chính sau khi đăng xuất
    }, 1000);
  });
});
