import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import ip from "ip";

const organization = "org-zQhEh3BKSWDo2UWzhBQuyI1V";
const apiKey =
  "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";
const openai = new OpenAI({ organization: organization, apiKey: apiKey });
const app = express();
const PORT = process.env.PORT || 5500;

app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Additional optimizations can be applied here

app.post("/receive_message", async (req, res) => {
  try {
    const userInput = req.body.content || "No content provided";
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            userInput +
            " summarise this in the same language as given with 5 bullet points within 8 words per point.it has to be complete and meaningful.",
        },
      ],
      model: "gpt-5-mini-2025-08-07",
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