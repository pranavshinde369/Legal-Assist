# Legal Assist

This is a modular, GenAI-powered web application that helps users understand, compare, and navigate complex legal documents. **Note: This tool provides information and assistance, and does not replace professional legal advice.**

## Architecture

This project is divided into two main parts:
- `backend/`: A Python FastAPI application that interacts with the Google Gemini API to analyze and simplify legal text.
- `frontend/`: A React (Vite) application styled with accessible, high-contrast Vanilla CSS.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- A Google Gemini API Key

### 1. Backend Setup
1. Navigate to the root directory.
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the root directory and add your API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn backend.main:app --reload
   ```

### 2. Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Features
- **Legalese Simplifier:** Translates complex text into plain English.
- **Risk Analyzer:** Highlights potential obligations, risks, and inconsistencies in the document.
- **Interactive Chat:** Allows users to ask questions specifically about the provided document.

## Evaluation Alignment
This project was built focusing on:
- **Code Quality:** Utilizing modern frameworks, TypeScript, and Pydantic validation.
- **Security:** Implementing CORS, secure env variables, and rigorous input validation.
- **Efficiency:** Async IO on the backend and lightweight Vite React frontend.
- **Testing:** Modular architecture ready for unit integration.
- **Accessibility:** Semantic HTML and ARIA standards in the UI.
