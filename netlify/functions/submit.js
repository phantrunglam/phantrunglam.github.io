// netlify/functions/submit.js
const fs = require("fs");
const path = require("path");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({ message: "Only POST requests are allowed" }),
    };
  }

  const body = JSON.parse(event.body);

  // Validate submission data (You can add more validation here)
  if (!body.comment || !body.user_id) {
    return {
      statusCode: 400, // Bad Request
      body: JSON.stringify({ message: "Missing required fields" }),
    };
  }

  // Path to the JSON file where submissions will be stored
  const filePath = path.join(__dirname, "../../submissions.json");

  try {
    // Read existing submissions (or create new array if file doesn't exist)
    const submissions = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
      : { submissions: [] };

    // Create new submission entry
    const newSubmission = {
      id: new Date().toISOString(),
      user_id: body.user_id,
      name: body.name || "Anonymous",
      email: body.email || "Anonymous",
      phone: body.phone || "N/A",
      comment: body.comment,
      media: body.media || [],
      linked_to: body.linked_to || "N/A",
      created_at: new Date().toISOString(),
      status: "active",
    };

    // Push new submission to existing list
    submissions.submissions.push(newSubmission);

    // Write updated submissions back to file
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Submission successfully saved" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500, // Internal Server Error
      body: JSON.stringify({
        message: "An error occurred while saving submission",
      }),
    };
  }
};
