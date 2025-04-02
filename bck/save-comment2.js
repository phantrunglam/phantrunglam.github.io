const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  const DATA_FILE = path.join(process.cwd(), "data", "submissions.json");
  const LOCK_FILE = DATA_FILE + ".lock"; // Khai báo lockFile ở đây

  // Xử lý CORS cho OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "OK",
    };
  }

  // Chỉ chấp nhận POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // 1. Kiểm tra và đợi lock
    while (fs.existsSync(LOCK_FILE)) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // 2. Tạo lock
    fs.writeFileSync(LOCK_FILE, "");

    // 3. Đọc dữ liệu hiện có
    const data = fs.existsSync(DATA_FILE)
      ? JSON.parse(fs.readFileSync(DATA_FILE, "utf8"))
      : { submissions: [] };

    // 4. Thêm comment mới
    const newComment = {
      id: Date.now().toString(),
      ...JSON.parse(event.body),
      created_at: new Date().toISOString(),
      status: "active",
    };

    data.submissions.unshift(newComment);

    // 5. Giới hạn 100 bản ghi
    if (data.submissions.length > 100) {
      data.submissions = data.submissions.slice(0, 100);
    }

    // 6. Ghi lại file
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    // 7. Xóa lock
    fs.unlinkSync(LOCK_FILE);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    };
  } catch (error) {
    // Xóa lock nếu có lỗi
    if (fs.existsSync(LOCK_FILE)) fs.unlinkSync(LOCK_FILE);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
    };
  }
};
