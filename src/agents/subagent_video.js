/**
 * Subagent Video
 * Motion Director & Storyboard Architect
 * Prompt: prompts/subagent_video_prompt.txt
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROMPT_PATH = path.resolve(__dirname, "../../prompts/subagent_video_prompt.txt");

export class SubagentVideo {
  constructor() {
    this.id = "subagent_video";
    this.name = "Subagent Video";
    this.prompt = this.loadPrompt();
  }

  loadPrompt() {
    try {
      return fs.readFileSync(PROMPT_PATH, "utf-8");
    } catch (e) {
      console.warn("Could not load prompt from file, using fallback:", e.message);
      return "Subagent Video System Prompt";
    }
  }

  async process(blackboard) {
    blackboard.log("Evaluating Video / Motion viability against network & slot constraints", this.id);

    const mathEval = blackboard.state.mathematical_evaluation;
    const formatBudget = mathEval.format_budget || {};
    const personaSpec = blackboard.state.subagent_contributions.persona_spec;
    const adConstraints = blackboard.state.inputs.ad_constraints;
    const network = adConstraints?.network || {};

    const isVideoAllowed = formatBudget.media_type === "VIDEO_RICH_MEDIA" && network.downlink_mbps >= 1.5;

    let videoSpec = {};

    if (!isVideoAllowed) {
      videoSpec = {
        video_enabled: false,
        gatekeeper_decision: "PROHIBITED_BY_NETWORK_OR_FORMAT",
        reason: network.downlink_mbps < 1.5
          ? `Connection speed (${network.downlink_mbps} Mbps) and buffer latency (${network.rtt_ms}ms) restrict video streaming to prevent user bounce.`
          : `Selected slot format (${formatBudget.width}x${formatBudget.height}) is designed for lightweight static/banner delivery.`,
        action: "Delegated primary visual narrative to Subagent Image. Generating static badge motion cue instead."
      };
      blackboard.log(`Video disabled by Bandwidth Gatekeeper: ${videoSpec.reason}`, this.id);
    } else {
      videoSpec = {
        video_enabled: true,
        gatekeeper_decision: "APPROVED_HIGH_BANDWIDTH",
        bandwidth_headroom: `${network.downlink_mbps} Mbps available`,
        max_duration_seconds: 15,
        variant_a_storyboard: {
          style: "Kinetic Action & High BPM Pacing",
          pacing: "Fast cuts (130 BPM)",
          scenes: [
            { time: "0:00 - 0:03", role: "3-Second Hook", description: "Explosive screen shatter with glowing gold chest opening immediately." },
            { time: "0:03 - 0:08", role: "Value Demonstration", description: "Rapid triple-combo gameplay / feature showcase showing instant progression." },
            { time: "0:08 - 0:12", role: "Challenge", description: "Only 5% of players unlock this in week 1. Will you?" },
            { time: "0:12 - 0:15", role: "End Card CTA", description: "Pulsing Claim Now button with glowing particles and tap animation." }
          ],
          audio_direction: "Punchy electronic synth hook with crisp UI sound effects."
        },
        variant_b_storyboard: {
          style: "Cinematic Mastery & Fluid Reveal",
          pacing: "Smooth fluid transitions (85 BPM)",
          scenes: [
            { time: "0:00 - 0:03", role: "3-Second Hook", description: "Elegant macro pan over sleek interface showing effortless auto-results." },
            { time: "0:03 - 0:08", role: "Value Demonstration", description: "Side-by-side comparison: hours of stress eliminated in 1 tap." },
            { time: "0:08 - 0:12", role: "VIP Social Proof", description: "Rated 4.9/5 stars by top practitioners across 40 countries." },
            { time: "0:12 - 0:15", role: "End Card CTA", description: "Minimalist glowing unlock button with subtle shimmer." }
          ],
          audio_direction: "Atmospheric ambient lo-fi soundscape with deep acoustic chime."
        }
      };
      blackboard.log("Video Storyboards generated for Variant A (Kinetic) & Variant B (Cinematic)", this.id);
    }

    blackboard.state.subagent_contributions.video_spec = videoSpec;
    return videoSpec;
  }
}
