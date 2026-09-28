/**
 * Ollama Integration Service
 * Connects to local Ollama runtime (http://localhost:11434) using model 'llama3.2:1b'.
 * Generates personalized creative ad copy based on user signals and agent system prompts.
 */

export class OllamaService {
  constructor(model = "llama3.2:1b", host = "http://localhost:11434") {
    this.model = model;
    this.host = host;
    this.timeoutMs = 50000;
  }

  /**
   * Check if Ollama is available
   */
  async isAvailable() {
    try {
      const res = await fetch(`${this.host}/api/tags`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Generate structured JSON from Ollama
   */
  async generateJson(systemPrompt, promptText) {
    try {
      const fullPrompt = `${systemPrompt}\n\nTask:\n${promptText}\n\nRespond ONLY with valid JSON. Do not include markdown codeblocks or commentary.`;

      const res = await fetch(`${this.host}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          prompt: fullPrompt,
          format: "json",
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 320
          }
        }),
        signal: AbortSignal.timeout(this.timeoutMs)
      });

      if (!res.ok) {
        throw new Error(`Ollama HTTP Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const rawText = data.response?.trim() || "{}";

      // Parse JSON with multi-layered extraction
      try {
        return JSON.parse(rawText);
      } catch (parseErr) {
        // Attempt to clean markdown backticks
        const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
        try {
          return JSON.parse(cleaned);
        } catch {
          // Extract outermost braces
          const braceMatch = cleaned.match(/\{[\s\S]*\}/);
          if (braceMatch) {
            try {
              return JSON.parse(braceMatch[0]);
            } catch {}
          }
          throw parseErr;
        }
      }
    } catch (err) {
      console.warn(`[OllamaService] Call failed (${err.message}). Using intelligent contextual generator.`);
      return null;
    }
  }
}

export const ollamaService = new OllamaService();
