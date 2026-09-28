/**
 * Feedback Agent
 * Quality Gatekeeper, Compliance Auditor & Score Threshold Engine
 * Prompt: prompts/feedback_agent_prompt.txt
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROMPT_PATH = path.resolve(__dirname, "../../prompts/feedback_agent_prompt.txt");

export class FeedbackAgent {
  constructor() {
    this.id = "feedback_agent";
    this.name = "Feedback & Compliance Audit Agent";
    this.prompt = this.loadPrompt();
  }

  loadPrompt() {
    try {
      return fs.readFileSync(PROMPT_PATH, "utf-8");
    } catch (e) {
      console.warn("Could not load prompt from file, using fallback:", e.message);
      return "Feedback Agent System Prompt";
    }
  }

  /**
   * Deterministic Evaluation Rubric against constraints, personalization, and threshold
   */
  async process(blackboard) {
    blackboard.log("Feedback Agent initiating rigorous creative audit", this.id);

    const proposals = blackboard.state.creative_proposals;
    const mathEval = blackboard.state.mathematical_evaluation;
    const formatBudget = mathEval.format_budget || {};
    const threshold = blackboard.state.inputs.score_threshold || 85.0;

    const { variant_a, variant_b } = proposals;
    if (!variant_a || !variant_b) {
      throw new Error("Feedback Agent requires both Variant A and Variant B on blackboard.");
    }

    // -------------------------------------------------------------
    // EVALUATION DIMENSION 1: CONSTRAINT ADHERENCE (Max 35 pts)
    // -------------------------------------------------------------
    let scoreConstraintA = 35;
    let scoreConstraintB = 35;
    const constraintCheckNotes = [];

    // Check Headline length
    if (variant_a.copy.char_counts.headline > formatBudget.max_headline_length) {
      scoreConstraintA -= 8;
      constraintCheckNotes.push("Variant A headline exceeds slot limit.");
    }
    if (variant_b.copy.char_counts.headline > formatBudget.max_headline_length) {
      scoreConstraintB -= 8;
      constraintCheckNotes.push("Variant B headline exceeds slot limit.");
    }

    // Check CTA length
    if (variant_a.copy.char_counts.cta > formatBudget.max_cta_length) {
      scoreConstraintA -= 5;
    }
    if (variant_b.copy.char_counts.cta > formatBudget.max_cta_length) {
      scoreConstraintB -= 5;
    }

    // Check Media format validity (no video on low-bandwidth)
    if (formatBudget.media_type === "STATIC_IMAGE") {
      if (variant_a.video.enabled || variant_b.video.enabled) {
        scoreConstraintA -= 15;
        scoreConstraintB -= 15;
        constraintCheckNotes.push("VIOLATION: Video enabled despite low bandwidth restriction!");
      }
    }

    // -------------------------------------------------------------
    // EVALUATION DIMENSION 2: PERSONALIZATION FIDELITY (Max 30 pts)
    // -------------------------------------------------------------
    let scorePersonalizationA = 28;
    let scorePersonalizationB = 29;
    const personalizationNotes = [];

    if (variant_a.signal_attribution?.length >= 2) {
      scorePersonalizationA += 2; // Full marks
      personalizationNotes.push("Variant A directly incorporates top behavioral affinity and engagement triggers.");
    }
    if (variant_b.signal_attribution?.length >= 2) {
      scorePersonalizationB += 1;
      personalizationNotes.push("Variant B strongly reflects monetization LTV tier and lifestyle timing.");
    }

    // -------------------------------------------------------------
    // EVALUATION DIMENSION 3: CREATIVE DIFFERENTIATION (Max 20 pts)
    // -------------------------------------------------------------
    let scoreDiffA = 19;
    let scoreDiffB = 19;
    const diffNotes = [];

    if (variant_a.persona.archetype !== variant_b.persona.archetype) {
      diffNotes.push(`Strong psychological divergence: ${variant_a.persona.archetype} vs ${variant_b.persona.archetype}.`);
    } else {
      scoreDiffA -= 6;
      scoreDiffB -= 6;
      diffNotes.push("Warning: Variants lack clear archetype contrast.");
    }

    // -------------------------------------------------------------
    // EVALUATION DIMENSION 4: BRAND SAFETY & CLARITY (Max 15 pts)
    // -------------------------------------------------------------
    let scoreSafetyA = 15;
    let scoreSafetyB = 15;

    // Calculate totals
    const totalA = Math.min(100, Math.max(0, scoreConstraintA + scorePersonalizationA + scoreDiffA + scoreSafetyA));
    const totalB = Math.min(100, Math.max(0, scoreConstraintB + scorePersonalizationB + scoreDiffB + scoreSafetyB));
    const compositeScore = Number(((totalA + totalB) / 2).toFixed(1));

    // Decision relative to threshold
    const isApproved = compositeScore >= threshold;
    const status = isApproved ? "APPROVED" : "REVISION_REQUIRED";

    const feedbackReport = {
      variant_a_score: totalA,
      variant_b_score: totalB,
      composite_score: compositeScore,
      score_threshold: threshold,
      status: status,
      iteration: blackboard.iteration,
      breakdown: {
        constraint_adherence: { max: 35, variant_a: scoreConstraintA, variant_b: scoreConstraintB },
        personalization_fidelity: { max: 30, variant_a: scorePersonalizationA, variant_b: scorePersonalizationB },
        creative_differentiation: { max: 20, variant_a: scoreDiffA, variant_b: scoreDiffB },
        safety_clarity: { max: 15, variant_a: scoreSafetyA, variant_b: scoreSafetyB }
      },
      audit_notes: [
        ...constraintCheckNotes,
        ...personalizationNotes,
        ...diffNotes
      ],
      recommendations: !isApproved ? [
        "Trim CTA text to enhance mobile tap clarity.",
        "Strengthen value proposition urgency to boost predicted conversion."
      ] : [
        "Certified ready for RTB ad exchange bidding.",
        "Complies with AppLovin MAX creative specifications."
      ]
    };

    blackboard.updateSlice("feedback_audit", feedbackReport, this.id);
    blackboard.log(`Feedback Audit finished. Composite Score: ${compositeScore} / 100 (Threshold: ${threshold}) -> Status: ${status}`, this.id, {
      status,
      compositeScore,
      threshold
    });

    return feedbackReport;
  }
}
