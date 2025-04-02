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
    const response = await fetch("../netlify/functions/save-comment", {
      method: "POST",
      body: JSON.stringify({
        name: document.getElementById("name").value,
        comment: document.getElementById("comment").value,
      }),
    });

    if (response.ok) {
      form.reset();
      await loadComments(); // Tải lại danh sách
    } else {
      throw new Error("Gửi thất bại");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Có lỗi xảy ra khi gửi: " + error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Gửi";
  }
});

// Hiển thị comments
function renderComments(comments) {
  commentsList.innerHTML = comments
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

// Tải comments từ JSON
async function loadComments() {
  try {
    const response = await fetch("/data/submissions.json?t=" + Date.now());
    const data = await response.json();
    renderComments(data.submissions);
  } catch (error) {
    console.error("Lỗi tải comments:", error);
  }
}

// Khởi tạo
loadComments();

// Auto-refresh mỗi 30s
setInterval(loadComments, 30000);
