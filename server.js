import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Cabin AI server running");
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
