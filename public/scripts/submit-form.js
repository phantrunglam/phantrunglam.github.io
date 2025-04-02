const submitForm = document.getElementById("submitForm");

submitForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(submitForm);
  const submission = {
    user_id: "123", // Đây là ID của người dùng đăng nhập, lấy từ session hoặc token
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    comment: formData.get("comment"),
    media: [], // Optional: Collect media files
    linked_to: formData.get("linked_to"), // Optional: Person/Event
  };

  try {
    const response = await fetch("/.netlify/functions/submit", {
      method: "POST",
      body: JSON.stringify(submission),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    alert(data.message);
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("There was an error submitting your form.");
  }
});
