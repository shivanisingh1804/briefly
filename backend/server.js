// import express from "express";
// import multer from "multer";
// // import pdfParse from "pdf-parse";
// import pdfParse from "pdf-parse/lib/pdf-parse.js";
// import Tesseract from "tesseract.js";
// import cors from "cors";
// import bodyParser from "body-parser";
// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// dotenv.config();

// const app = express();
// // const PORT = 5000;

// app.use(cors());
// app.use(bodyParser.json());

// // Multer for file uploads
// const upload = multer({ dest: "uploads/" });

// // Gemini API setup
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // -------------------- Extract Text --------------------
// app.post("/extract-text", upload.single("file"), async (req, res) => {
//   try {
//     const filePath = req.file.path;
//     const ext = path.extname(req.file.originalname).toLowerCase();
//     let extractedText = "";

//     if (ext === ".pdf") {
//       const dataBuffer = fs.readFileSync(filePath);
//       const pdfData = await pdfParse(dataBuffer);
//       extractedText = pdfData.text;
//     } else if ([".png", ".jpg", ".jpeg"].includes(ext)) {
//       const result = await Tesseract.recognize(filePath, "eng");
//       extractedText = result.data.text;
//     } else {
//       return res.status(400).json({ error: "Unsupported file type" });
//     }

//     fs.unlinkSync(filePath); // cleanup temp file
//     res.json({ text: extractedText.trim() });
//   } catch (err) {
//     console.error("Error extracting text:", err);
//     res.status(500).json({ error: "Failed to extract text" });
//   }
// });

// // -------------------- Summarize --------------------
// app.post("/summarize", async (req, res) => {
//   try {
//     const { text, length, options } = req.body;

//     if (!text) {
//       return res.status(400).json({ error: "No text provided" });
//     }

//     // Construct prompt
//     let prompt = `Summarize the following text in a ${length} form.`;
//     if (options.highlight) prompt += " Highlight the key points.";
//     if (options.stopwords) prompt += " Remove unnecessary filler words.";
//     if (options.smart) prompt += " Organize into coherent paragraphs.";
//     prompt += `\n\nText:\n${text}`;

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const result = await model.generateContent(prompt);
//     const summary = result.response.text();

//     res.json({ summary });
//   } catch (err) {
//     console.error("Error summarizing:", err);
//     res.status(500).json({ error: "Failed to generate summary" });
//   }
// });

// // app.listen(PORT, () => {
// //   console.log(`🚀 Backend running at http://localhost:${PORT}`);
// // });
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Backend running on port ${PORT}`);
// });
import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import Tesseract from "tesseract.js";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS setup (update with your frontend URL)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend dev
      "https://briefly-frontend-omega.vercel.app", // deployed frontend (Vercel)
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(bodyParser.json());

// ✅ Multer for file uploads
const upload = multer({ dest: "uploads/" });

// ✅ Gemini API setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// -------------------- Extract Text --------------------
app.post("/extract-text", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let extractedText = "";

    if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if ([".png", ".jpg", ".jpeg"].includes(ext)) {
      const result = await Tesseract.recognize(filePath, "eng");
      extractedText = result.data.text;
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    fs.unlinkSync(filePath); // cleanup temp file
    res.json({ text: extractedText.trim() });
  } catch (err) {
    console.error("❌ Error extracting text:", err);
    res.status(500).json({ error: "Failed to extract text" });
  }
});

// -------------------- Summarize --------------------
app.post("/summarize", async (req, res) => {
  try {
    const { text, length, options } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    // Build dynamic prompt
    let prompt = `Summarize the following text in a ${length} form.`;
    if (options?.highlight) prompt += " Highlight the key points.";
    if (options?.stopwords) prompt += " Remove unnecessary filler words.";
    if (options?.smart) prompt += " Organize into coherent paragraphs.";
    prompt += `\n\nText:\n${text}`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ summary });
  } catch (err) {
    console.error("❌ Error summarizing:", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
