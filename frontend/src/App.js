// import React, { useState } from "react";
// import "./App.css"; // ✅ your custom styles

// function App() {
//   const [file, setFile] = useState(null);
//   const [summaryLength, setSummaryLength] = useState("short");
//   const [options, setOptions] = useState({
//     highlight: true,
//     stopwords: true,
//     smart: true,
//   });
//   const [status, setStatus] = useState("Waiting for file...");
//   const [extractedText, setExtractedText] = useState("");
//   const [summary, setSummary] = useState("");

//   // ✅ Update file state when uploading
//   const handleFileUpload = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setStatus(`Uploaded: ${selectedFile.name}`);
//     }
//   };

//   // ✅ Call backend to extract text from PDF
//   const handleExtractText = async () => {
//     if (!file) {
//       setStatus("No file selected.");
//       return;
//     }

//     setStatus("Extracting text...");

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("http://localhost:5000/extract-text", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (data.text) {
//         setExtractedText(data.text);
//         setStatus("Text extracted!");
//       } else {
//         setStatus("Extraction failed.");
//       }
//     } catch (err) {
//       console.error(err);
//       setStatus("Server error during text extraction.");
//     }
//   };

//   // ✅ Call backend to generate summary using Gemini API
//   const handleGenerateSummary = async () => {
//     if (!extractedText) {
//       setStatus("No extracted text to summarize.");
//       return;
//     }

//     setStatus("Generating summary...");

//     try {
//       const response = await fetch("http://localhost:5000/summarize", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           text: extractedText,
//           length: summaryLength,
//           options,
//         }),
//       });

//       const data = await response.json();

//       if (data.summary) {
//         setSummary(data.summary);
//         setStatus("Summary generated!");
//       } else {
//         setStatus("Summary failed.");
//       }
//     } catch (err) {
//       console.error(err);
//       setStatus("Server error during summary generation.");
//     }
//   };

//   return (
//     <div className="app">
//       {/* Header */}
//       <h1 className="header">📄 Document Summary Assistant</h1>

//       {/* Upload Section */}
//       <div className="upload-box">
//         <span className="upload-icon">⬆️</span>
//         <p>Drag & drop PDF or Image here</p>
//         <input type="file" onChange={handleFileUpload} id="fileInput" hidden />
//         <label htmlFor="fileInput" className="choose-btn">Choose file</label>
//       </div>

//       {/* Controls */}
//       <div className="grid">
//         {/* Summary length */}
//         <div className="card">
//           <h2>Summary length</h2>
//           {["short", "medium", "long"].map((len) => (
//             <label key={len}>
//               <input
//                 type="radio"
//                 name="summaryLength"
//                 value={len}
//                 checked={summaryLength === len}
//                 onChange={(e) => setSummaryLength(e.target.value)}
//               />
//               {len.charAt(0).toUpperCase() + len.slice(1)}
//             </label>
//           ))}
//         </div>

//         {/* Options */}
//         <div className="card">
//           <h2>Options</h2>
//           {Object.keys(options).map((opt) => (
//             <label key={opt}>
//               <input
//                 type="checkbox"
//                 checked={options[opt]}
//                 onChange={() =>
//                   setOptions({ ...options, [opt]: !options[opt] })
//                 }
//               />
//               {opt === "highlight" && "Highlight key points"}
//               {opt === "stopwords" && "Remove stopwords"}
//               {opt === "smart" && "Smart paragraphs"}
//             </label>
//           ))}
//         </div>

//         {/* Actions */}
//         <div className="card actions">
//           <h2>Actions</h2>
//           <button className="btn blue" onClick={handleExtractText}>Extract Text</button>
//           <button className="btn green" onClick={handleGenerateSummary}>Generate Summary</button>
//           <button className="btn gray" disabled>Download Summary (.txt)</button>
//         </div>

//         {/* Status */}
//         <div className="card">
//           <h2>Status</h2>
//           <p>{status}</p>
//         </div>
//       </div>

//       {/* Suggestions */}
//       <div className="card">
//         <h2>Improvement suggestions</h2>
//         <ul>
//           <li>Use clear headings and bullet points in documents.</li>
//           <li>Prefer searchable PDFs over scanned images.</li>
//           <li>Avoid photos of angled pages for better OCR.</li>
//           <li>Use consistent terminology across the document.</li>
//         </ul>
//       </div>

//       {/* Extracted Text & Summary */}
//       <div className="grid">
//         <div className="card">
//           <h2>Extracted Text</h2>
//           <p>{extractedText}</p>
//         </div>
//         <div className="card">
//           <h2>Summary</h2>
//           <p>{summary}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
