// DOM Elements
const form = document.getElementById("comment-form");
const commentsList = document.getElementById("comments-list");

// Gửi comment
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Đang gửi...";

  try {
    const response = await fetch(
      "https://phantrunglam.netlify.app/.netlify/functions/save-comment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: document.getElementById("name").value,
          comment: document.getElementById("comment").value,
        }),
      }
    );

    const result = await response.json(); // Luôn parse JSON dù success/error

    if (!response.ok) {
      throw new Error(result.error || "Gửi thất bại");
    }

    form.reset();
    await loadComments();
    alert("Gửi thành công!");
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Lỗi: " + error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Gửi";
  }
});

// Hiển thị comments
function renderComments(comments) {
  commentsList.innerHTML = comments
    .filter((comment) => comment.status !== "hidden") // Chỉ hiện comment active
    .map(
      (comment) => `
    <div class="comment">
      <div class="comment-text">${comment.comment}</div>
      <div class="comment-meta">
        <strong>${comment.name}</strong> - 
        ${new Date(comment.created_at).toLocaleString()}
      </div>
    </div>
  `
    )
    .join("");
}

// Tải comments
async function loadComments() {
  try {
    const response = await fetch(
      "https://phantrunglam.netlify.app/data/submissions.json?t=" + Date.now()
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    renderComments(data.submissions || []); // Xử lý case file rỗng
  } catch (error) {
    console.error("Lỗi tải comments:", error);
    commentsList.innerHTML = `<p class="error">Không tải được bình luận. Vui lòng thử lại sau.</p>`;
  }
}

// Khởi tạo
document.addEventListener("DOMContentLoaded", () => {
  loadComments();
  setInterval(loadComments, 30000);
});
