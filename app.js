import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import cors from "cors";
import ip from "ip";

const organization = "org-zQhEh3BKSWDo2UWzhBQuyI1V";
const apiKey = "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";
const openai = new OpenAI({ organization: organization, apiKey: apiKey });
const app = express();
const PORT = process.env.PORT || 5500;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/receive_message", async (req, res) => {
  try {
    const userInput = req.body.content || "No content provided";
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            userInput +
            "summarise this in same language with 5 bullet points within six words per point",
        },
      ],
      model: "gpt-3.5-turbo",
    });

    res.json({
      message: "Message received successfully",
      completion: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error("Error processing request:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const server = app.listen(PORT, "0.0.0.0", () => {
  const ipAddress = ip.address();
  console.log(`Server is running at http://${ipAddress}:${PORT}`);
});

server.on("listening", () => {
  const ipAddress = ip.address();
  console.log(`Server is listening at http://${ipAddress}:${PORT}`);
});

server.on("error", (error) => {
  console.error("Error starting server:", error);
});
