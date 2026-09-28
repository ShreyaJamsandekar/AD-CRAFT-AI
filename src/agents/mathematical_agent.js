/**
 * Mathematical Agent
 * Deterministic Weighting & Constraint Prioritization Engine
 * Prompt: prompts/mathematical_agent_prompt.txt
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROMPT_PATH = path.resolve(__dirname, "../../prompts/mathematical_agent_prompt.txt");

export class MathematicalAgent {
  constructor() {
    this.id = "mathematical_agent";
    this.name = "Mathematical Optimization Agent";
    this.prompt = this.loadPrompt();
  }

  loadPrompt() {
    try {
      return fs.readFileSync(PROMPT_PATH, "utf-8");
    } catch (e) {
      console.warn("Could not load prompt from file, using fallback:", e.message);
      return "Mathematical Agent System Prompt";
    }
  }

  /**
   * Main execution: Analyzes constraints and computes signal weights deterministically.
   */
  async process(blackboard) {
    blackboard.log("Ingesting User Profile & Ad Constraints for deterministic scoring", this.id);

    const { user_profile, ad_constraints } = blackboard.state.inputs;
    if (!user_profile || !ad_constraints) {
      throw new Error("Missing required inputs on blackboard: user_profile or ad_constraints");
    }

    // -------------------------------------------------------------
    // PHASE 1: PRIORITIZE DELIVERY CONSTRAINTS (HARD FILTERS FIRST)
    // -------------------------------------------------------------
    const network = ad_constraints.network || {};
    const slot = ad_constraints.slot || {};

    const prioritizedConstraints = [];

    // Constraint 1: Network Bandwidth & Latency (Critical for format gating)
    const isBandwidthRestricted = (network.downlink_mbps < 1.5) || network.data_saver_active;
    prioritizedConstraints.push({
      priority: 1,
      type: "NETWORK_BANDWIDTH",
      rule: "Bandwidth & Buffer Latency Gate",
      metric: `${network.downlink_mbps || 0} Mbps | RTT ${network.rtt_ms || 0}ms`,
      impact: isBandwidthRestricted
        ? "CRITICAL: Prohibit video streaming to prevent user bounce; enforce lightweight Static/SVG asset."
        : "PERMITTED: High-speed connection supports rich video/interactive playable.",
      enforced_format: isBandwidthRestricted ? "STATIC_IMAGE" : "VIDEO_RICH_MEDIA"
    });

    // Constraint 2: Display Dimensions & Surface Area
    prioritizedConstraints.push({
      priority: 2,
      type: "DISPLAY_SURFACE",
      rule: "Slot Dimensions & Character Density Limits",
      metric: `${slot.width}x${slot.height} (${slot.name})`,
      impact: `Enforce Headline <= ${slot.max_headline_chars} chars, Body <= ${slot.max_body_chars} chars, CTA <= ${slot.max_cta_chars} chars.`,
      max_headline_chars: slot.max_headline_chars,
      max_body_chars: slot.max_body_chars,
      max_cta_chars: slot.max_cta_chars
    });

    // Constraint 3: File Payload Budget
    const effectivePayloadLimitKb = isBandwidthRestricted 
      ? Math.min(slot.default_payload_limit_kb || 200, 180)
      : (slot.default_payload_limit_kb || 1500);
    prioritizedConstraints.push({
      priority: 3,
      type: "PAYLOAD_BUDGET",
      rule: "Max Transfer Size",
      metric: `${effectivePayloadLimitKb} KB`,
      impact: `Hard cap on asset size to guarantee < 100ms render initiation.`
    });

    // Constraint 4: Brand Safety & Age/COPPA
    const isCoppa = user_profile.compliance?.coppa_flag === 1 || user_profile.demographics?.age < 18;
    prioritizedConstraints.push({
      priority: 4,
      type: "BRAND_SAFETY",
      rule: "COPPA & Demographic Content Protection",
      metric: isCoppa ? "RESTRICTED (Minor/Child safe)" : "GENERAL AUDIENCE (Standard)",
      impact: isCoppa 
        ? "Prohibit aggressive monetary claims, alcohol, dating, or intense violence."
        : "Standard ad network policy applies."
    });

    // -------------------------------------------------------------
    // PHASE 2: DETERMINISTIC PERSONALIZATION FEATURE WEIGHTING
    // -------------------------------------------------------------
    // Formula: W_i = BaseScore * Confidence * RecencyFactor * LTVFactor
    const signals = [];

    // 1. Primary Category Affinity
    const primaryAffinity = user_profile.behavioral_signals?.primary_affinity || "General";
    signals.push({
      signal: "Primary App / Category Affinity",
      value: primaryAffinity,
      category: "Interest & Intent",
      baseScore: 0.95,
      confidence: 0.98,
      recencyFactor: 1.0,
      ltvFactor: 1.0,
      weight: 0.931,
      creative_implication: `Anchor ad theme and imagery directly in ${primaryAffinity}.`
    });

    // 2. Predicted LTV Tier
    const ltvTier = user_profile.behavioral_signals?.predicted_ltv_tier || "Mid";
    const isHighLtv = ltvTier.toLowerCase().includes("high");
    signals.push({
      signal: "Predicted LTV Tier",
      value: ltvTier,
      category: "Monetization Potential",
      baseScore: 0.88,
      confidence: 0.92,
      recencyFactor: 1.0,
      ltvFactor: isHighLtv ? 1.15 : 0.95,
      weight: isHighLtv ? 0.930 : 0.770,
      creative_implication: isHighLtv 
        ? "Position product as VIP/Premium with exclusive high-tier perks."
        : "Highlight instant value, free bonuses, and risk-free trial."
    });

    // 3. Historical CTR Propensity
    const ctr = user_profile.behavioral_signals?.historical_ctr || 0.02;
    const isHighCtr = ctr >= 0.035;
    signals.push({
      signal: "Historical CTR Engagement",
      value: `${(ctr * 100).toFixed(1)}% CTR`,
      category: "Engagement Propensity",
      baseScore: 0.82,
      confidence: 0.95,
      recencyFactor: 1.0,
      ltvFactor: 1.0,
      weight: 0.779,
      creative_implication: isHighCtr
        ? "User responds well to interactive challenges and direct action triggers."
        : "User is selective; requires crystal-clear utility proposition."
    });

    // 4. In-App Purchase (IAP) Recency
    const iapDays = user_profile.behavioral_signals?.iap_recency_days ?? 30;
    const isSpenderRecent = iapDays <= 7;
    signals.push({
      signal: "IAP Recency (Days Since Purchase)",
      value: `${iapDays} days ago`,
      category: "Conversion Readiness",
      baseScore: 0.80,
      confidence: 0.90,
      recencyFactor: isSpenderRecent ? 1.05 : 0.85,
      ltvFactor: 1.0,
      weight: isSpenderRecent ? 0.756 : 0.612,
      creative_implication: isSpenderRecent
        ? "Active buyer mindset: present immediate in-app upgrade or limited-edition item."
        : "Lapsed purchaser: emphasize re-engagement coupon or zero-friction entry."
    });

    // 5. Publisher Context / Current App
    const currentApp = user_profile.app_context?.current_app_name || "Host App";
    signals.push({
      signal: "Host App Context & Category",
      value: `${currentApp} (${user_profile.app_context?.iab_category || "General"})`,
      category: "Contextual Relevance",
      baseScore: 0.78,
      confidence: 0.96,
      recencyFactor: 1.0,
      ltvFactor: 0.95,
      weight: 0.711,
      creative_implication: `Maintain thematic harmony with ${currentApp} aesthetic to prevent intrusive visual shock.`
    });

    // 6. Dayparting / Hour of Day
    const daypart = user_profile.app_context?.daypart || "Afternoon";
    const isEvening = daypart.toLowerCase().includes("evening");
    const isMorning = daypart.toLowerCase().includes("morning");
    signals.push({
      signal: "Dayparting Context",
      value: daypart,
      category: "Temporal Mindset",
      baseScore: 0.70,
      confidence: 0.95,
      recencyFactor: 1.0,
      ltvFactor: 1.0,
      weight: 0.665,
      creative_implication: isEvening 
        ? "Evening relaxation mode: prioritize entertainment, escapism, and casual gameplay."
        : (isMorning ? "Morning productivity mode: prioritize focus, efficiency, and smart habits." : "Balanced daytime tone.")
    });

    // 7. Geo Location & Metro Tier
    const location = user_profile.demographics?.location || {};
    signals.push({
      signal: "Geographic Metro Tier",
      value: `${location.city}, ${location.region} (${location.metro_tier || "Tier 1"})`,
      category: "Demographic Nuance",
      baseScore: 0.65,
      confidence: 0.99,
      recencyFactor: 1.0,
      ltvFactor: 1.0,
      weight: 0.643,
      creative_implication: "Target localized US English phrasing and contemporary urban tone."
    });

    // 8. Device Hardware Tier
    const hardwareTier = user_profile.device?.hardware_tier || "Standard";
    const deviceModel = `${user_profile.device?.make} ${user_profile.device?.model}`;
    signals.push({
      signal: "Hardware Capability Tier",
      value: `${deviceModel} (${hardwareTier})`,
      category: "Device Experience",
      baseScore: 0.60,
      confidence: 0.98,
      recencyFactor: 1.0,
      ltvFactor: 1.05,
      weight: 0.617,
      creative_implication: hardwareTier === "Flagship"
        ? "Device supports ultra-crisp gradients, subtle drop shadows, and high-DPR typography."
        : "Optimize for standard contrast and simple geometry."
    });

    // 9. Rewarded Ad / Discount Propensity
    const discountSensitivity = user_profile.behavioral_signals?.discount_coupon_sensitivity || 
      user_profile.behavioral_signals?.rewarded_video_propensity || 0.5;
    signals.push({
      signal: "Incentive Sensitivity Score",
      value: `${(discountSensitivity * 100).toFixed(0)}% Affinity`,
      category: "Incentive Mechanism",
      baseScore: 0.62,
      confidence: 0.90,
      recencyFactor: 1.0,
      ltvFactor: 1.0,
      weight: 0.558,
      creative_implication: discountSensitivity > 0.75 
        ? "Display prominent reward badge or limited-time unlock counter."
        : "Rely on intrinsic product value rather than heavy discount badges."
    });

    // Sort signals descending by weight
    signals.sort((a, b) => b.weight - a.weight);

    // Extract TOP 7 Signals (within the requested 5-10 range)
    const topWeightedSignals = signals.slice(0, 7);

    // -------------------------------------------------------------
    // PHASE 3: WRITE TO BLACKBOARD
    // -------------------------------------------------------------
    const mathematicalEvaluation = {
      prioritized_constraints: prioritizedConstraints,
      top_weighted_signals: topWeightedSignals,
      format_budget: {
        media_type: isBandwidthRestricted ? "STATIC_IMAGE" : (slot.supports_video ? "VIDEO_RICH_MEDIA" : "STATIC_IMAGE"),
        max_payload_kb: effectivePayloadLimitKb,
        max_headline_length: slot.max_headline_chars,
        max_body_length: slot.max_body_chars,
        max_cta_length: slot.max_cta_chars,
        width: slot.width,
        height: slot.height,
        aspect_ratio: slot.aspect_ratio
      },
      summary: `Computed ${signals.length} signals. Extracted Top ${topWeightedSignals.length} variables. Gated media format to ${isBandwidthRestricted ? 'STATIC_IMAGE' : 'VIDEO_RICH_MEDIA'}.`
    };

    blackboard.updateSlice("mathematical_evaluation", mathematicalEvaluation, this.id);
    blackboard.log(`Mathematical evaluation complete. Media format gated to: ${mathematicalEvaluation.format_budget.media_type}`, this.id, {
      topSignal: topWeightedSignals[0]?.signal,
      topWeight: topWeightedSignals[0]?.weight
    });

    return mathematicalEvaluation;
  }
}
