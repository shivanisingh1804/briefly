import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Waiting for file...");
  const [extractedText, setExtractedText] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState("short");
  const [options, setOptions] = useState({
    highlight: true,
    stopwords: true,
    smart: true,
  });
  const [dragActive, setDragActive] = useState(false);
  const [history, setHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 🔍 Analysis state
  const [analysis, setAnalysis] = useState({
    wordCount: 0,
    tone: "Unknown",
    docType: "Unknown",
  });

  // 🌗 Theme state
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.className = theme === "light" ? "light" : "";
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // --- file handlers ---
  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setStatus(`File uploaded: ${selectedFile.name}`);
      setExtractedText("");
      setSummary("");
      setAnalysis({ wordCount: 0, tone: "Unknown", docType: "Unknown" });
    }
  };

  const handleFileChange = (e) => handleFile(e.target.files[0]);
  const handleChooseFile = () => document.getElementById("fileInput").click();

  // --- Drag & Drop ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // --- Backend: Extract text ---
  const handleExtractText = async () => {
    if (!file) {
      setStatus("⚠️ Please upload a file first");
      return;
    }
    setStatus("Extracting text...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/extract-text`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.text) {
        setExtractedText(data.text);
        setStatus("✅ Text extracted successfully");
        analyzeText(data.text);
      } else {
        setStatus("❌ Extraction failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error during extraction");
    }
  };

  // --- Backend: Summarize ---
  const handleGenerateSummary = async () => {
    if (!extractedText) {
      setStatus("⚠️ Extract text before generating summary");
      return;
    }
    setStatus("Generating summary...");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText, length: summaryLength, options }),
      });

      const data = await response.json();

      if (data.summary) {
        setSummary(data.summary);
        setStatus("✅ Summary generated");
        setHistory((prev) => [
          ...prev,
          {
            fileName: file ? file.name : "Untitled",
            timestamp: new Date().toLocaleString(),
          },
        ]);
      } else {
        setStatus("❌ Summary failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error during summary generation");
    }
  };

  // --- Download ---
  const handleDownload = () => {
    if (!summary) return;
    const element = document.createElement("a");
    const fileBlob = new Blob([summary], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = "summary.txt";
    document.body.appendChild(element);
    element.click();
  };

  // --- Copy ---
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setStatus("📋 Copied to clipboard");
  };

  // --- Speak ---
  const handleSpeak = (text) => {
    if (!text) return;
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // --- Analysis ---
  const analyzeText = (text) => {
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    let tone = "Neutral";
    if (/dear|sincerely|regards|respectfully/i.test(text)) tone = "Formal";
    else if (/hey|lol|thanks|cheers/i.test(text)) tone = "Informal";

    let docType = "General";
    if (/research|study|methodology|data/i.test(text)) docType = "Academic";
    else if (/invoice|meeting|report|project/i.test(text)) docType = "Business";
    else if (/story|novel|chapter/i.test(text)) docType = "Literary";

    setAnalysis({ wordCount, tone, docType });
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>📄 Briefly</h1>
        <p className="tagline">"Turning documents into insights, instantly"</p>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      {/* Hidden file input */}
      <input
        type="file"
        id="fileInput"
        accept=".pdf,.png,.jpg,.jpeg"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Main Grid */}
      <div className="main-grid row">
        {/* Upload Section */}
        <div
          className={`upload-section ${dragActive ? "drag-active" : ""} col-md-4`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-box">
            <div className="upload-icon">⬆️</div>
            {file ? (
              <>
                <p><strong>{file.name}</strong></p>
                <button className="btn blue-btn" onClick={handleChooseFile}>
                  Another file
                </button>
              </>
            ) : (
              <>
                <p>Drag & drop PDF or Image here</p>
                <p className="or">or</p>
                <button className="btn blue-btn" onClick={handleChooseFile}>
                  Choose file
                </button>
              </>
            )}
          </div>
        </div>

        {/* Analysis Box */}
        <div className="card analysis-box col-md-4">
          <h2>Document Analysis</h2>
          <p><strong>Word Count:</strong> {analysis.wordCount}</p>
          <p><strong>Tone:</strong> {analysis.tone}</p>
          <p><strong>Document Type:</strong> {analysis.docType}</p>
        </div>

        {/* Suggestions */}
        <div className="card col-md-4">
          <h2>Improvement suggestions</h2>
          <ul>
            <li>Use clear headings and bullet points</li>
            <li>Prefer searchable PDFs over images</li>
            <li>Avoid angled page photos</li>
            <li>Use consistent terminology</li>
          </ul>
        </div>
      </div>

      {/* Options Row */}
      <div className="options-grid">
        <div className="card">
          <h2>Summary length</h2>
          {["short", "medium", "long"].map((len) => (
            <label key={len}>
              <input
                type="radio"
                name="length"
                value={len}
                checked={summaryLength === len}
                onChange={(e) => setSummaryLength(e.target.value)}
              />
              {len.charAt(0).toUpperCase() + len.slice(1)}
            </label>
          ))}
        </div>

        <div className="card">
          <h2>Options</h2>
          {Object.keys(options).map((opt) => (
            <label key={opt}>
              <input
                type="checkbox"
                checked={options[opt]}
                onChange={() =>
                  setOptions({ ...options, [opt]: !options[opt] })
                }
              />
              {opt === "highlight" && "Highlight key points"}
              {opt === "stopwords" && "Remove stopwords"}
              {opt === "smart" && "Smart paragraphs"}
            </label>
          ))}
        </div>

        <div className="card">
          <h2>Actions</h2>
          <button className="btn primary" onClick={handleExtractText}>
            Extract Text
          </button>
          <button className="btn success" onClick={handleGenerateSummary}>
            Generate Summary
          </button>
          <button
            className={`btn ${summary ? "" : "disabled"}`}
            onClick={handleDownload}
            disabled={!summary}
          >
            Download Summary (.txt)
          </button>
        </div>

        <div className="card">
          <h2>Status</h2>
          <p>{status}</p>
        </div>
      </div>

      {/* Extracted Text + Summary */}
      <div className="bottom-grid">
        <div className="card">
          <div className="card-header">
            <h2>Extracted Text</h2>
            <div>
              <button
                className="icon-btn"
                onClick={() => handleCopy(extractedText)}
              >
                📋
              </button>
              <button
                className="icon-btn"
                onClick={() => handleSpeak(extractedText)}
              >
                {isSpeaking ? "⏸️" : "▶️"}
              </button>
            </div>
          </div>
          <p>{extractedText || "..."}</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Summary</h2>
            <div>
              <button className="icon-btn" onClick={() => handleCopy(summary)}>
                📋
              </button>
              <button className="icon-btn" onClick={() => handleSpeak(summary)}>
                {isSpeaking ? "⏸️" : "▶️"}
              </button>
            </div>
          </div>
          <p>{summary || "..."}</p>
        </div>
      </div>

      {/* History */}
      <div className="historycard">
        <h2>History</h2>
        {history.length === 0 ? (
          <p>No past tasks yet.</p>
        ) : (
          <ul>
            {history.map((item, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <strong>{item.fileName}</strong> <br />
                <em>{item.timestamp}</em>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
