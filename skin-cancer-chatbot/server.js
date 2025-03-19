

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");


// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI({
  apiKey: "AIzaSyCWvsJHEcT2hA0hwczildCye55tw7_kv4U", // Load API key from environment variables
});

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Generate the response
    const result = await genAI.generateText({
      model: "text-bison-001", // Use a valid model name
      prompt: `You are a medical assistant specialized in skin cancer. Answer this: "${userMessage}"`,
      temperature: 0.7,
      maxOutputTokens: 200,
    });

    const botResponse = result?.candidates[0]?.output || "Sorry, I couldn't generate a response.";
    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error generating AI response:", error.message);
    res.status(500).json({ response: "Something went wrong. Please try again later." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
