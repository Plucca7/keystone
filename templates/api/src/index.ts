import { startServer } from './server.js'

// Entry point kept as a thin one-liner: tooling and the project scaffold
// expect src/index.ts to exist, but all real bootstrap logic lives in
// server.ts (process concerns) and app.ts (application wiring).
// Decision: `void` instead of top-level await — startServer never resolves
// while the server runs, and its own catch already handles startup failure.
void startServer()
