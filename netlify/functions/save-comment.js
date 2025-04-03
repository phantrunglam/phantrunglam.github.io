//const fetch = require("node-fetch");

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    // 1. Validate input
    if (!event.body) throw new Error("Missing request body");
    const body = JSON.parse(event.body);
    console.log("Parsed body:", body);

    // 2. Prepare GitHub API request
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) throw new Error("Missing GitHub token");

    const REPO = "phantrunglam/phantrunglam.github.io";
    const FILE_PATH = "public/data/submissions.json";
    const apiUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

    console.log("Fetching file from GitHub...");
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });

    if (!getRes.ok) {
      const errorText = await getRes.text();
      console.error("GitHub API error:", getRes.status, errorText);
      throw new Error(`GitHub API failed: ${getRes.status}`);
    }

    const { sha, content } = await getRes.json();
    console.log("Current file SHA:", sha);

    // 3. Process data
    const currentContent = Buffer.from(content, "base64").toString("utf-8");
    const currentData = JSON.parse(currentContent);
    console.log("Current submissions count:", currentData.submissions.length);

    const newEntry = {
      ...body,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    currentData.submissions.unshift(newEntry);

    // 4. Update file
    console.log("Updating GitHub file...");
    const updateRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update submissions via Netlify Function",
        content: Buffer.from(JSON.stringify(currentData)).toString("base64"),
        sha: sha,
      }),
    });

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      console.error("GitHub update error:", updateRes.status, errorText);
      throw new Error("Failed to update file");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Full error stack:", error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Processing failed",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
    };
  }
};
