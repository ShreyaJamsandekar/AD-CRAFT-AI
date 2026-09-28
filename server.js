/**
 * Production-Grade Node.js HTTP Server
 * Serves static web dashboard and REST API for AI Ad Tracking Blackboard Pipeline.
 * Integrates local Ollama LLM (llama3.2:1b).
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SYNTHETIC_USER_PRESETS } from "./src/data/synthetic_users.js";
import { AD_SLOT_FORMATS, NETWORK_PROFILES, DEFAULT_PIPELINE_CONFIG } from "./src/data/ad_constraints.js";
import { AdTrackingPipeline } from "./src/pipeline/ad_pipeline.js";
import { ollamaService } from "./src/services/ollama_service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const PROMPTS_DIR = path.join(__dirname, "prompts");

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".txt": "text/plain"
};

// Mutable list of synthetic users so custom additions persist during server lifecycle
const userPresets = [...SYNTHETIC_USER_PRESETS];
const pipeline = new AdTrackingPipeline();

// Helper to read prompts directory
function getPromptsMap() {
  const promptFiles = [
    { key: "mathematical_agent", filename: "mathematical_agent_prompt.txt", name: "Mathematical Agent (Deterministic Scoring)" },
    { key: "creativation_prompt", filename: "creativation_prompt.txt", name: "Creative Agent Orchestrator (Creativation Engine)" },
    { key: "subagent_persona", filename: "subagent_persona_prompt.txt", name: "Subagent Persona (Psychological Hook)" },
    { key: "subagent_image", filename: "subagent_image_prompt.txt", name: "Subagent Image (Visual Layout & Styling)" },
    { key: "subagent_video", filename: "subagent_video_prompt.txt", name: "Subagent Video (Motion Pacing & 3s Hook)" },
    { key: "feedback_agent", filename: "feedback_agent_prompt.txt", name: "Feedback & Compliance Agent (Threshold Gatekeeper)" }
  ];

  const results = {};
  for (const item of promptFiles) {
    const filePath = path.join(PROMPTS_DIR, item.filename);
    try {
      results[item.key] = {
        filename: item.filename,
        title: item.name,
        content: fs.readFileSync(filePath, "utf-8")
      };
    } catch (e) {
      results[item.key] = {
        filename: item.filename,
        title: item.name,
        content: `Error loading file: ${e.message}`
      };
    }
  }
  return results;
}

// Request dispatcher
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Route: GET /api/presets
  if (req.method === "GET" && pathname === "/api/presets") {
    const isOllamaOnline = await ollamaService.isAvailable();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      users: userPresets,
      slots: AD_SLOT_FORMATS,
      networks: NETWORK_PROFILES,
      config: DEFAULT_PIPELINE_CONFIG,
      ollama_status: {
        online: isOllamaOnline,
        model: "llama3.2:1b"
      }
    }));
    return;
  }

  // API Route: POST /api/users/add (Add Custom User Profile)
  if (req.method === "POST" && pathname === "/api/users/add") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        const newUser = JSON.parse(body || "{}");
        if (!newUser.name || !newUser.behavioral_signals?.primary_affinity) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing required fields: name and primary_affinity" }));
          return;
        }

        newUser.id = `user_custom_${Date.now()}`;
        newUser.avatar = newUser.avatar || "👤";
        userPresets.unshift(newUser); // Add to top

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, user: newUser, users: userPresets }));
      } catch (e) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API Route: GET /api/prompts
  if (req.method === "GET" && pathname === "/api/prompts") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getPromptsMap()));
    return;
  }

  // API Route: POST /api/pipeline/stream (Server-Sent Events for Real-Time Multi-Agent Flow)
  if (req.method === "POST" && pathname === "/api/pipeline/stream") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", async () => {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      });

      const sendEvent = (event, data) => {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      };

      try {
        const payload = JSON.parse(body || "{}");
        await pipeline.run({
          user_profile: payload.user_profile || userPresets[0],
          ad_constraints: payload.ad_constraints || {
            slot: AD_SLOT_FORMATS[0],
            network: NETWORK_PROFILES[0]
          },
          score_threshold: Number(payload.score_threshold) || 85.0,
          max_iterations: Number(payload.max_iterations) || 3,
          onProgress: (prog) => {
            sendEvent(prog.stage, prog);
          }
        });
        res.end();
      } catch (err) {
        sendEvent("error", { error: err.message });
        res.end();
      }
    });
    return;
  }

  // API Route: POST /api/pipeline/run (Standard JSON response)
  if (req.method === "POST" && pathname === "/api/pipeline/run") {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const result = await pipeline.run({
          user_profile: payload.user_profile || userPresets[0],
          ad_constraints: payload.ad_constraints || {
            slot: AD_SLOT_FORMATS[0],
            network: NETWORK_PROFILES[0]
          },
          score_threshold: Number(payload.score_threshold) || 85.0,
          max_iterations: Number(payload.max_iterations) || 3
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        console.error("Pipeline run error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message, stack: err.stack }));
      }
    });
    return;
  }

  // Static File Serving
  let relativeFilePath = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
  let absoluteFilePath = path.join(PUBLIC_DIR, relativeFilePath);

  // Security check to avoid directory traversal
  if (!absoluteFilePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(absoluteFilePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const fallbackPath = path.join(PUBLIC_DIR, "index.html");
      if (fs.existsSync(fallbackPath)) {
        res.writeHead(200, { "Content-Type": "text/html" });
        fs.createReadStream(fallbackPath).pipe(res);
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
      return;
    }

    const ext = path.extname(absoluteFilePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(absoluteFilePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  AI-Assisted Ad Tracking Server Online (Ollama Ready)  `);
  console.log(`  Dashboard URL: http://localhost:${PORT}              `);
  console.log(`=======================================================`);
});
