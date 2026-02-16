import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

/* ===== VERY IMPORTANT HEALTH ROUTE ===== */
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

/* ===== AI ROUTE ===== */
app.post("/generate-images", async (req, res) => {
  try {

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing API key" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const { prompts } = req.body;

    if (!prompts) {
      return res.status(400).json({ error: "No prompts" });
    }

    const images = [];

    for (const prompt of prompts) {
      const result = await openai.images.generate({
        model: "gpt-image-1",
        prompt: prompt,
        size: "1024x1792"
      });

      images.push(result.data[0].url);
    }

    res.json({ images });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("SERVER READY");
});
