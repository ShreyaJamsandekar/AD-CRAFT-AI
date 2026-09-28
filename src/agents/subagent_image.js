/**
 * Subagent Image
 * Visual Designer & Asset Composition Architect
 * Dynamically pairs visual palettes, contrast, and badges with the Persona Subagent's
 * 8-archetype taxonomy.
 * Prompt: prompts/subagent_image_prompt.txt
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROMPT_PATH = path.resolve(__dirname, "../../prompts/subagent_image_prompt.txt");

export class SubagentImage {
  constructor() {
    this.id = "subagent_image";
    this.name = "Subagent Image";
    this.prompt = this.loadPrompt();
  }

  loadPrompt() {
    try {
      return fs.readFileSync(PROMPT_PATH, "utf-8");
    } catch (e) {
      console.warn("Could not load prompt from file, using fallback:", e.message);
      return "Subagent Image System Prompt";
    }
  }

  async process(blackboard) {
    blackboard.log("Subagent Image styling visual composition to match Persona Archetypes", this.id);

    const mathEval = blackboard.state.mathematical_evaluation;
    const formatBudget = mathEval.format_budget;
    const personaSpec = blackboard.state.subagent_contributions.persona_spec;
    const userProfile = blackboard.state.inputs.user_profile;
    const category = (userProfile.behavioral_signals?.primary_affinity || "Lifestyle").toLowerCase();

    const themeA = (personaSpec?.angle_a?.theme_category || "").toLowerCase();
    const themeB = (personaSpec?.angle_b?.theme_category || "").toLowerCase();

    // Determine base hero asset
    let assetUrl = "/assets/ad_gaming.jpg";
    if (category.includes("coffee") || category.includes("tea") || category.includes("apparel") || category.includes("fashion") || category.includes("sneaker")) {
      assetUrl = "/assets/ad_ecommerce.jpg";
    } else if (category.includes("finance") || category.includes("invest") || category.includes("wealth") || category.includes("crypto")) {
      assetUrl = "/assets/ad_fintech.jpg";
    } else if (category.includes("fitness") || category.includes("health") || category.includes("gym")) {
      assetUrl = "/assets/ad_fitness.svg";
    }

    // Unified Visual Palette Resolver for all 8 Archetypes
    const resolvePalette = (archetype = "", themeCategory = "", isVariantA = true) => {
      const combined = `${archetype} ${themeCategory}`.toLowerCase();

      if (combined.includes("humor") || combined.includes("witty") || combined.includes("meme")) {
        return {
          bg: "linear-gradient(135deg, rgba(20, 15, 38, 0.96), rgba(124, 58, 237, 0.85))",
          accent: "#facc15",
          badge: "😜 ZERO FLUFF",
          glow: "rgba(250, 204, 21, 0.35)",
          cta: "background: linear-gradient(135deg, #facc15, #eab308); color: #000; font-weight: 800; box-shadow: 0 4px 14px rgba(250, 204, 21, 0.35);"
        };
      } else if (combined.includes("zen") || combined.includes("mindful") || combined.includes("calm") || combined.includes("cozy")) {
        return {
          bg: "linear-gradient(135deg, rgba(17, 24, 39, 0.96), rgba(20, 83, 45, 0.85))",
          accent: "#34d399",
          badge: "🌿 MINDFUL CALM",
          glow: "rgba(52, 211, 153, 0.35)",
          cta: "background: linear-gradient(135deg, #34d399, #059669); color: #fff; font-weight: 700; box-shadow: 0 4px 14px rgba(52, 211, 153, 0.35);"
        };
      } else if (combined.includes("prestige") || combined.includes("luxury") || combined.includes("connoisseur")) {
        return {
          bg: "linear-gradient(135deg, rgba(12, 14, 24, 0.97), rgba(49, 46, 129, 0.85))",
          accent: "#fbbf24",
          badge: "👑 BESPOKE VIP",
          glow: "rgba(251, 191, 36, 0.35)",
          cta: "background: linear-gradient(135deg, #fbbf24, #d97706); color: #000; font-weight: 800; box-shadow: 0 4px 14px rgba(251, 191, 36, 0.35);"
        };
      } else if (combined.includes("hacker") || combined.includes("efficiency") || combined.includes("tactical")) {
        return {
          bg: "linear-gradient(135deg, rgba(8, 20, 36, 0.96), rgba(2, 132, 199, 0.85))",
          accent: "#38bdf8",
          badge: "⚡ 30s HACK",
          glow: "rgba(56, 189, 248, 0.35)",
          cta: "background: linear-gradient(135deg, #38bdf8, #0284c7); color: #000; font-weight: 800; box-shadow: 0 4px 14px rgba(56, 189, 248, 0.35);"
        };
      } else if (combined.includes("velocity") || combined.includes("adrenaline") || combined.includes("beast") || combined.includes("roller")) {
        return {
          bg: "linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(217, 119, 6, 0.85))",
          accent: "#f59e0b",
          badge: "🔥 CRUSH IT",
          glow: "rgba(245, 158, 11, 0.4)",
          cta: "background: linear-gradient(135deg, #f59e0b, #ea580c); color: #000; font-weight: 800; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);"
        };
      } else if (combined.includes("deal") || combined.includes("vault") || combined.includes("drop") || combined.includes("hunter")) {
        return {
          bg: "linear-gradient(135deg, rgba(26, 11, 22, 0.97), rgba(225, 29, 72, 0.85))",
          accent: "#f43f5e",
          badge: "🏷️ 48H VAULT",
          glow: "rgba(244, 63, 94, 0.4)",
          cta: "background: linear-gradient(135deg, #f43f5e, #be123c); color: #fff; font-weight: 800; box-shadow: 0 4px 14px rgba(244, 63, 94, 0.35);"
        };
      } else if (combined.includes("rebel") || combined.includes("disruptor") || combined.includes("bold")) {
        return {
          bg: "linear-gradient(135deg, rgba(10, 10, 12, 0.96), rgba(225, 29, 72, 0.85))",
          accent: "#fb7185",
          badge: "💥 BREAK RULES",
          glow: "rgba(251, 113, 133, 0.4)",
          cta: "background: linear-gradient(135deg, #fb7185, #e11d48); color: #fff; font-weight: 800; box-shadow: 0 4px 14px rgba(251, 113, 133, 0.35);"
        };
      } else if (combined.includes("community") || combined.includes("story") || combined.includes("belonging")) {
        return {
          bg: "linear-gradient(135deg, rgba(26, 21, 40, 0.96), rgba(249, 115, 22, 0.85))",
          accent: "#fb923c",
          badge: "🤝 OUR STORY",
          glow: "rgba(251, 146, 60, 0.35)",
          cta: "background: linear-gradient(135deg, #fb923c, #ea580c); color: #000; font-weight: 800; box-shadow: 0 4px 14px rgba(251, 146, 60, 0.35);"
        };
      }

      // Default high-contrast fallback
      return {
        bg: isVariantA ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(79, 70, 229, 0.85))" : "linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(6, 95, 70, 0.85))",
        accent: isVariantA ? "#f59e0b" : "#10b981",
        badge: isVariantA ? "⚡ DYNAMIC HOOK" : "✦ REFINED VALUE",
        glow: isVariantA ? "rgba(245, 158, 11, 0.35)" : "rgba(16, 185, 129, 0.35)",
        cta: isVariantA ? "background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800;" : "background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-weight: 700;"
      };
    };

    const palA = resolvePalette(personaSpec?.angle_a?.archetype, personaSpec?.angle_a?.theme_category, true);
    const palB = resolvePalette(personaSpec?.angle_b?.archetype, personaSpec?.angle_b?.theme_category, false);

    const slotType = formatBudget.width > formatBudget.height ? "horizontal_banner" : 
      (formatBudget.width === formatBudget.height || formatBudget.height / formatBudget.width < 1.4 ? "rectangular_card" : "vertical_portrait");

    const imageSpec = {
      slot_dimensions: `${formatBudget.width}x${formatBudget.height}`,
      aspect_ratio: formatBudget.aspect_ratio,
      layout_pattern: slotType,
      variant_a_visual: {
        theme_name: personaSpec?.angle_a?.archetype || "High-Energy Kinetic Aura",
        primary_asset_url: assetUrl,
        background_style: palA.bg,
        accent_color: palA.accent,
        glow_color: palA.glow,
        badge_text: palA.badge,
        badge_style: `background: linear-gradient(90deg, ${palA.accent}, #ef4444); color: #000; font-weight: 800;`,
        cta_button_style: palA.cta,
        composition_notes: `Tailored to ${personaSpec?.angle_a?.archetype}.`
      },
      variant_b_visual: {
        theme_name: personaSpec?.angle_b?.archetype || "Sleek Minimalist Mastery",
        primary_asset_url: assetUrl,
        background_style: palB.bg,
        accent_color: palB.accent,
        glow_color: palB.glow,
        badge_text: palB.badge,
        badge_style: `background: rgba(255, 255, 255, 0.1); border: 1px solid ${palB.accent}; color: ${palB.accent}; font-weight: 700;`,
        cta_button_style: palB.cta,
        composition_notes: `Tailored to ${personaSpec?.angle_b?.archetype}.`
      }
    };

    blackboard.state.subagent_contributions.image_spec = imageSpec;
    return imageSpec;
  }
}
