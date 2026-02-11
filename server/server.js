import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname / __filename for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent folder
dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

import http from "http";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
