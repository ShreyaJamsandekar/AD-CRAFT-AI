/**
 * Creative Agent Orchestrator ("Creativation Engine")
 * Subagent Orchestrator & Multi-Variant Synthesis Engine
 * Prompt: prompts/creativation_prompt.txt
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SubagentPersona } from "./subagent_persona.js";
import { SubagentImage } from "./subagent_image.js";
import { SubagentVideo } from "./subagent_video.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROMPT_PATH = path.resolve(__dirname, "../../prompts/creativation_prompt.txt");

export class CreativeOrchestrator {
  constructor() {
    this.id = "creative_agent_orchestrator";
    this.name = "Creative Agent Orchestrator (Creativation Engine)";
    this.prompt = this.loadPrompt();

    // The 3 subagents under its command
    this.subagentPersona = new SubagentPersona();
    this.subagentImage = new SubagentImage();
    this.subagentVideo = new SubagentVideo();
  }

  loadPrompt() {
    try {
      return fs.readFileSync(PROMPT_PATH, "utf-8");
    } catch (e) {
      console.warn("Could not load prompt from file, using fallback:", e.message);
      return "Creative Agent Orchestrator System Prompt";
    }
  }

  /**
   * Truncates text cleanly without cutting words in half
   */
  truncate(text, maxChars) {
    if (!text || maxChars <= 0) return "";
    if (text.length <= maxChars) return text;
    const truncated = text.substring(0, maxChars - 3);
    const lastSpace = truncated.lastIndexOf(" ");
    return (lastSpace > 10 ? truncated.substring(0, lastSpace) : truncated) + "...";
  }

  /**
   * Orchestrates the 3 subagents and synthesizes two distinct ad variants.
   */
  async process(blackboard, feedbackAdjustment = null) {
    blackboard.log("Creative Orchestrator initiating multi-agent dispatch", this.id, {
      iteration: blackboard.iteration,
      hasFeedbackAdjustment: !!feedbackAdjustment
    });

    // 1. Invoke Subagent Persona
    const personaSpec = await this.subagentPersona.process(blackboard);

    // 2. Invoke Subagent Image
    const imageSpec = await this.subagentImage.process(blackboard);

    // 3. Invoke Subagent Video
    const videoSpec = await this.subagentVideo.process(blackboard);

    // 4. Blackboard Cross-Agent Synthesis
    const mathEval = blackboard.state.mathematical_evaluation;
    const formatBudget = mathEval.format_budget || {};
    const topSignals = mathEval.top_weighted_signals || [];

    const maxH = formatBudget.max_headline_length || 45;
    const maxB = formatBudget.max_body_length || 80;
    const maxC = formatBudget.max_cta_length || 15;

    // Apply any revision feedback adjustments if this is a refinement pass
    let headlineA = personaSpec.angle_a.headline_raw;
    let headlineB = personaSpec.angle_b.headline_raw;
    let ctaA = personaSpec.angle_a.cta_raw;
    let ctaB = personaSpec.angle_b.cta_raw;

    if (feedbackAdjustment?.refine_variant_a) {
      headlineA = feedbackAdjustment.refine_variant_a.headline || headlineA;
      ctaA = feedbackAdjustment.refine_variant_a.cta || ctaA;
      blackboard.log("Applied Feedback Agent refinements to Variant A", this.id);
    }
    if (feedbackAdjustment?.refine_variant_b) {
      headlineB = feedbackAdjustment.refine_variant_b.headline || headlineB;
      ctaB = feedbackAdjustment.refine_variant_b.cta || ctaB;
      blackboard.log("Applied Feedback Agent refinements to Variant B", this.id);
    }

    // Strictly enforce slot character budget (Hard Priority Constraint)
    const boundedHeadlineA = this.truncate(headlineA, maxH);
    const boundedHeadlineB = this.truncate(headlineB, maxH);
    const boundedBodyA = maxB > 0 ? this.truncate(personaSpec.angle_a.subheadline_raw, maxB) : "";
    const boundedBodyB = maxB > 0 ? this.truncate(personaSpec.angle_b.subheadline_raw, maxB) : "";
    const boundedCtaA = this.truncate(ctaA, maxC);
    const boundedCtaB = this.truncate(ctaB, maxC);

    // -------------------------------------------------------------
    // SYNTHESIZE VARIANT A: HIGH-ENERGY / ACTION / REWARD
    // -------------------------------------------------------------
    const variantA = {
      variant_id: "variant_a",
      name: `Variant A: ${personaSpec.angle_a.archetype}`,
      persona: {
        archetype: personaSpec.angle_a.archetype,
        theme_category: personaSpec.angle_a.theme_category,
        tone: personaSpec.angle_a.tone,
        trigger: personaSpec.angle_a.psychological_trigger
      },
      copy: {
        headline: boundedHeadlineA,
        body: boundedBodyA,
        cta: boundedCtaA,
        char_counts: {
          headline: boundedHeadlineA.length,
          body: boundedBodyA.length,
          cta: boundedCtaA.length
        }
      },
      visual: {
        theme: imageSpec.variant_a_visual.theme_name,
        asset_url: imageSpec.variant_a_visual.primary_asset_url,
        background: imageSpec.variant_a_visual.background_style,
        accent_color: imageSpec.variant_a_visual.accent_color,
        badge_text: imageSpec.variant_a_visual.badge_text,
        badge_style: imageSpec.variant_a_visual.badge_style,
        cta_style: imageSpec.variant_a_visual.cta_button_style,
        width: formatBudget.width,
        height: formatBudget.height,
        aspect_ratio: formatBudget.aspect_ratio
      },
      video: videoSpec.video_enabled ? {
        enabled: true,
        storyboard: videoSpec.variant_a_storyboard
      } : {
        enabled: false,
        fallback_notice: videoSpec.reason
      },
      signal_attribution: [
        { signal: topSignals[0]?.signal, value: topSignals[0]?.value, weight: topSignals[0]?.weight },
        { signal: topSignals[2]?.signal, value: topSignals[2]?.value, weight: topSignals[2]?.weight },
        { signal: topSignals[5]?.signal, value: topSignals[5]?.value, weight: topSignals[5]?.weight }
      ]
    };

    // -------------------------------------------------------------
    // SYNTHESIZE VARIANT B: STRATEGIC / VALUE / PRESTIGE
    // -------------------------------------------------------------
    const variantB = {
      variant_id: "variant_b",
      name: `Variant B: ${personaSpec.angle_b.archetype}`,
      persona: {
        archetype: personaSpec.angle_b.archetype,
        theme_category: personaSpec.angle_b.theme_category,
        tone: personaSpec.angle_b.tone,
        trigger: personaSpec.angle_b.psychological_trigger
      },
      copy: {
        headline: boundedHeadlineB,
        body: boundedBodyB,
        cta: boundedCtaB,
        char_counts: {
          headline: boundedHeadlineB.length,
          body: boundedBodyB.length,
          cta: boundedCtaB.length
        }
      },
      visual: {
        theme: imageSpec.variant_b_visual.theme_name,
        asset_url: imageSpec.variant_b_visual.primary_asset_url,
        background: imageSpec.variant_b_visual.background_style,
        accent_color: imageSpec.variant_b_visual.accent_color,
        badge_text: imageSpec.variant_b_visual.badge_text,
        badge_style: imageSpec.variant_b_visual.badge_style,
        cta_style: imageSpec.variant_b_visual.cta_button_style,
        width: formatBudget.width,
        height: formatBudget.height,
        aspect_ratio: formatBudget.aspect_ratio
      },
      video: videoSpec.video_enabled ? {
        enabled: true,
        storyboard: videoSpec.variant_b_storyboard
      } : {
        enabled: false,
        fallback_notice: videoSpec.reason
      },
      signal_attribution: [
        { signal: topSignals[1]?.signal, value: topSignals[1]?.value, weight: topSignals[1]?.weight },
        { signal: topSignals[3]?.signal, value: topSignals[3]?.value, weight: topSignals[3]?.weight },
        { signal: topSignals[6]?.signal, value: topSignals[6]?.value, weight: topSignals[6]?.weight }
      ]
    };

    const creativeProposals = {
      variant_a: variantA,
      variant_b: variantB,
      iteration: blackboard.iteration,
      synthesized_at: new Date().toISOString()
    };

    blackboard.updateSlice("creative_proposals", creativeProposals, this.id);
    blackboard.log("Creative Proposals (Variant A & Variant B) synthesized and posted to Blackboard", this.id);

    return creativeProposals;
  }
}
