# Flam AI - Trip Planner

A smart trip planner that takes natural language input and generates a detailed, day-by-day itinerary using Google's Gemini 2.5 Flash model. Features include drag-and-drop reordering, interactive UI, and robust error handling for AI responses.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, @dnd-kit (for drag and drop), Zod (schema validation)
- **Backend**: Express proxy server (to secure the Gemini API key)
- **AI**: `@google/generative-ai` (Gemini 2.5 Flash)

## Setup & Running Locally

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Open `.env` in the root folder and add your Gemini API Key:
```env
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

3. Start the application (starts both backend and frontend):
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Architecture & AI Integration

The core challenge of AI UI development is handling unpredictable output. This app handles it by:
1. **Schema Validation**: Using Zod in the frontend to validate the JSON payload shape before rendering.
2. **Race Condition Prevention**: Using `AbortController` and request IDs inside a custom `useAIQuery` hook to guarantee stale requests don't overwrite fresh ones.
3. **Structured Prompting**: Forcing the LLM to reply strictly according to an OpenAPI-style JSON schema.

## AI Usage Note
During the development of this project, an AI assistant (Google Antigravity) was used for:
- Scaffolding the React components.
- Generating boilerplate Tailwind CSS styles.
- Formulating the specific Gemini JSON schema.
All architecture decisions, error-handling strategies (AbortController/Zod validation), and complex Drag-and-Drop integration were manually guided and reviewed.

## Known Limitations
- The drag-and-drop currently only supports reordering stops within their own day or moving stops to the very end of another day (full cross-list precision drop targets are a work-in-progress).
- AI generation time is dependent on Gemini API latency.
- Refinement loop ("edit this itinerary") is not yet implemented in this MVP.

## Time Spent
- ~4 hours (scaffolding, backend setup, UI design, drag-and-drop integration, error boundaries/schema validation).
