document.addEventListener("DOMContentLoaded", () => {
  if (typeof netlifyIdentity === "undefined") {
    console.error("Netlify Identity chưa được tải!");
    return;
  }

  netlifyIdentity.on("login", (user) => {
    console.log("Đăng nhập thành công:", user);
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "dashboard.html"; // Chuyển hướng sau đăng nhập
  });

  netlifyIdentity.on("logout", () => {
    console.log("Đã đăng xuất");
    localStorage.removeItem("user");
    window.location.href = "index.html"; // Chuyển về trang chủ sau khi đăng xuất
  });

  document.getElementById("loginButton").addEventListener("click", () => {
    netlifyIdentity.open("login");
  });

  document.getElementById("logoutButton").addEventListener("click", () => {
    netlifyIdentity.logout();
  });
});
