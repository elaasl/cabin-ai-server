import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";


const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY missing");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


// health check (Railway needs this FAST)
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.post("/generate-images", async (req, res) => {
  try {
    const { prompts } = req.body;

    if (!prompts || !Array.isArray(prompts)) {
      return res.status(400).json({ error: "Prompts array required" });
    }

    const results = [];

    for (const prompt of prompts) {
      const img = await client.images.generate({
        model: "gpt-image-1",
        prompt: prompt,
        size: "1024x1792"
      });

      results.push(img.data[0].url);
    }

    res.json({ images: results });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// IMPORTANT for Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});

