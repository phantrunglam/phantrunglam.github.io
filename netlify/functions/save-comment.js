const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const DATA_FILE = path.join(process.cwd(), "data", "submissions.json");
  const lockFile = DATA_FILE + ".lock";

  try {
    // 1. Đợi nếu file đang bị lock
    while (fs.existsSync(lockFile)) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // 2. Tạo lock
    fs.writeFileSync(lockFile, "");

    // 3. Đọc dữ liệu hiện có
    const rawData = fs.readFileSync(DATA_FILE, "utf8");
    const data = JSON.parse(rawData);

    // 4. Thêm comment mới
    const newComment = {
      id: Date.now().toString(),
      ...JSON.parse(event.body),
      created_at: new Date().toISOString(),
      status: "active",
    };

    data.submissions.unshift(newComment);

    // 5. Giới hạn 100 comment mới nhất
    if (data.submissions.length > 100) {
      data.submissions = data.submissions.slice(0, 100);
    }

    // 6. Ghi lại file
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    // 7. Xóa lock
    fs.unlinkSync(lockFile);

    return {
      statusCode: 200,
      body: JSON.stringify(newComment),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    if (fs.existsSync(lockFile)) fs.unlinkSync(lockFile);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
