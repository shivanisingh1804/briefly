# 📄 Briefly – Document Summarizer

"Turning documents into insights, instantly."

Briefly is a full-stack web app that allows users to upload **PDFs or images** and instantly get **summarized insights**.  
It extracts text, analyzes tone, word count, and document type, and generates a **clean summary** with improvement suggestions.

---

## 🚀 Live Demo -
[https://briefly-frontend-omega.vercel.app](https://briefly-frontend-omega.vercel.app)  

---

## 🛠 Tech Stack

**Frontend**
- React + Vite  
- TailwindCSS for styling  
- ShadCN UI Components  

**Backend**
- Node.js + Express  
- Multer (for file upload)  
- pdf-parse / Tesseract.js (for PDF & image text extraction)  
- OpenAI API (for summarization & tone analysis)

  ** Deployment Links -
- **Frontend (Vercel):** [https://briefly-frontend-omega.vercel.app](https://briefly-frontend-omega.vercel.app)  
- **Backend (Render):** [https://briefly-backend.onrender.com](https://briefly-backend.onrender.com)


**Deployment**
- Frontend → [Vercel](https://vercel.com/)  
- Backend → [Render](https://render.com/)  

---

## ⚙️ Features
✅ Upload PDF or image  
✅ Extract text automatically  
✅ Word count & tone analysis  
✅ Generate AI-powered summaries (short, medium, long)  
✅ Download summary as `.txt`  
✅ Dark/Light mode UI  
✅ Deployed full-stack (Frontend + Backend)  

---

## 📂 Project Structure
```

briefly/
│── frontend/        # React + Vite frontend
│── backend/         # Express.js backend
│── README.md        # Project documentation

````

---

## 🔧 Local Development Setup

### 1. Clone the repository
```bash
https://github.com/shivanisingh1804/briefly.git
cd briefly
````

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` inside `frontend/`:

```env
# Local backend
REACT_APP_BACKEND_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

App runs at 👉 `http://localhost:5173`

---

### 3. Backend Setup

```bash
cd backend
npm install
```

Create `.env` inside `backend/`:

```env
PORT=5000
GEMINII_API_KEY=your_api_key_here
```

Run backend:

```bash
npm start
```

Backend runs at 👉 `http://localhost:5000`

---

## 🌍 Deployment Setup

### Frontend (Vercel)

* Push `frontend/` to GitHub
* Connect repo to Vercel
* Add environment variable in Vercel settings:

  ```
  REACT_APP_BACKEND_URL=https://briefly-backend.onrender.com
  ```

### Backend (Render)

* Push `backend/` to GitHub
* Deploy on Render (Web Service)
* Add environment variable:

  ```
  GEMINI_API_KEY=your_api_key_here
  ```

---

👩‍💻 **Developed by:** Shivani Singh

```
