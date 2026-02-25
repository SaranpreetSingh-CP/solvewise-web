# SolveWise App Plan

## Goal

Build a professional learning chatbot that delivers lesson content and guided practice for math topics.

## Architecture

- **Frontend**: React (Vite), MUI + styled-components
- **Backend**: HTTP API (POST /chat)
- **Data flow**:
  1. Generate `sessionId` on first load.
  2. First user input is treated as the **topic**.
  3. First request sends `{ sessionId, topic, message: topic }` to backend.
  4. Lesson response renders topic, concepts, examples.
  5. Follow-up requests send `{ sessionId, message }` (no topic).

## Phase 1 Architecture Diagram

- React FE
  - Topic selection
  - Lesson display
  - Practice interaction
- Node BE
  - Session controller
  - Mode handler
  - LLM orchestration
- In-memory session store

## Core Data Models

- **History Item**
  - `userQuestion: string`
  - `tutorResponse: object` (lesson/practice/error)

- **Lesson Response**
  - `type: "lesson"`
  - `topic: string`
  - `concepts: string[]`
  - `examples: { problem: string; steps: string[]; final_answer: string }[]`

- **Practice Response**
  - `type: "practice" | undefined`
  - `final_answer: string`
  - `steps: string[]`
  - `explanation: string`

- **Error Response**
  - `type: "error"`
  - `explanation: string`

## Frontend Components

- **App**
  - Owns `sessionId`, `selectedTopic`, `history`, `isTyping`
  - Calls `sendMessageToChatAPI`
  - Passes data to `ChatWindow`

- **ChatWindow**
  - Layout + sidebar + header + messages
  - Shows current topic
  - Shows initial bot prompt when no topic

- **MessageBubble**
  - Renders lesson, practice, and error payloads
  - Avoids raw JSON

- **ChatInput**
  - Controlled input with send on enter/click

- **chatApi service**
  - POST /chat with structured payload
  - Validates response shape
  - Throws user-friendly error

## Roles & Responsibilities

- **User**: selects topic, asks questions
- **Tutor (bot)**: provides lesson, practice answers, and explanations

## Current Features

- Topic selection via first user message
- Lesson rendering (topic, concepts, examples)
- Practice rendering (answer, steps, explanation)
- Error handling and loading state
- Session-based API calls

## Next Features (Planned)

- Topic suggestions/autocomplete
- Save chat history per session
- Export lesson notes
- Practice quiz mode
- Accessibility and keyboard shortcuts

## Phased Roadmap

### 🚀 Phase 2 — Real Interaction Upgrade

- Streaming responses (real-time typing)
- Interrupt capability
- Better UI transitions
- Visual formatting (MathJax)
- Still no PDF or RAG

### 🚀 Phase 3 — Document Intelligence

- PDF upload
- Text extraction
- Chunking
- Embeddings
- Retrieval-based answering

### 🚀 Phase 4 — Visual & Diagram Engine

- SVG diagram generation
- Graph plotting
- Geometry visualizer
- Concept drawings

### 🚀 Phase 5 — Analytics & Mastery Engine

- DB persistence
- User profiles
- Mastery tracking
- Weakness detection
- Adaptive difficulty

## File Structure (Frontend)

- src/components/
  - ChatWindow.jsx
  - MessageBubble.jsx
  - ChatInput.jsx
- src/services/
  - chatApi.js
- src/styles/
  - chatStyles.js
- src/constants/
  - chatConstants.js

Phase 0 — Core LLM Engine (Backend: ✔ partial)
Phase 1 — Interactive Tutor MVP (Backend: △, Frontend: ◻)
Phase 2 — Streaming & Interruption (Not started)
Phase 3 — Document/RAG (Not started)
Phase 4 — Visual/Diagram Support (Not started)
Phase 5 — Analytics & Mastery (Not started)
