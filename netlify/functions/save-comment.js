const fetch = require("node-fetch");

console.log("Function loaded at:", new Date());
exports.handler = async (event) => {
  console.log("Incoming request:", event.body);
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = "phantrunglam/phantrunglam"; // Thay bằng repo của bạn
  const FILE_PATH = "public/data/submissions.json"; // Đường dẫn file trong repo

  // 1. Lấy nội dung file hiện tại từ GitHub
  const apiUrl = `https://api.github.com/repos/phantrunglam/phantrunglam/contents/public/data/submissions.json`;
  // const apiUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

  try {
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
    });

    if (!getRes.ok) throw new Error(`GitHub API error: ${getRes.statusText}`);

    const { sha, content } = await getRes.json();
    const currentContent = Buffer.from(content, "base64").toString("utf8");
    const currentData = JSON.parse(currentContent);

    // 2. Thêm comment mới
    const newComment = {
      ...JSON.parse(event.body),
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    currentData.submissions.unshift(newComment);

    // 3. Cập nhật file qua GitHub API
    const updateRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update submissions via Netlify Function",
        content: Buffer.from(JSON.stringify(currentData, null, 2)).toString(
          "base64"
        ),
        sha: sha, // Quan trọng: SHA của file hiện tại
      }),
    });

    if (!updateRes.ok) throw new Error(await updateRes.text());

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "GitHub API Error",
        details: error.message,
      }),
    };
  }
};
