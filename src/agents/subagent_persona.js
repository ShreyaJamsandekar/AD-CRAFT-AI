/**
 * Subagent Persona
 * Behavioral Psychologist & Narrative Angle Architect
 * Uses local Ollama model (llama3.2:1b) with a rich 8-archetype taxonomy:
 * Witty/Humorous, Zen/Mindful, VIP Prestige, Analytical Life-Hacker,
 * High-Velocity Competitor, Urgent Deal Hunter, Bold Rebel, and Community Storyteller.
 * Prompt: prompts/subagent_persona_prompt.txt
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ollamaService } from "../services/ollama_service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROMPT_PATH = path.resolve(__dirname, "../../prompts/subagent_persona_prompt.txt");

export class SubagentPersona {
  constructor() {
    this.id = "subagent_persona";
    this.name = "Subagent Persona";
    this.prompt = this.loadPrompt();
  }

  loadPrompt() {
    try {
      return fs.readFileSync(PROMPT_PATH, "utf-8");
    } catch (e) {
      console.warn("Could not load prompt from file, using fallback:", e.message);
      return "Subagent Persona System Prompt";
    }
  }

  /**
   * Dynamically pick two contrasting archetypes from the 8-archetype taxonomy
   * based on themeMode, category, age, LTV, and time of day.
   */
  selectContrastingArchetypes(userProfile, category, themeMode = "auto") {
    const cat = category.toLowerCase();
    const ltv = String(userProfile.behavioral_signals?.predicted_ltv_tier || "").toLowerCase();
    const isHighLtv = ltv.includes("high") || ltv.includes("ultra");
    const age = userProfile.demographics?.age || 28;

    // Explicit User Selected Theme Modes
    if (themeMode === "humor_zen") {
      return {
        pairA: {
          archetype: "The Witty Disruptor",
          theme_category: "Playful Humor & Meme",
          tone: "Cheeky, self-aware, delightfully sarcastic, relatable",
          trigger: "Instant dopamine smile & anti-routine humor",
          visual_style: "Electric neon violet & cyber yellow with cheeky badge"
        },
        pairB: {
          archetype: "The Zen Mindful Escapist",
          theme_category: "Mindful / Cozy Calm",
          tone: "Warm, peaceful, meditative, slow-living perfection",
          trigger: "Effortless stress relief & mindful artisan comfort",
          visual_style: "Soft ceramic cream & sage green glassmorphism"
        }
      };
    } else if (themeMode === "prestige_action") {
      return {
        pairA: {
          archetype: "The VIP Prestige Connoisseur",
          theme_category: "Aspirational Luxury",
          tone: "Sophisticated, understated luxury, discerning, elite",
          trigger: "Discerning taste & pride in master craft",
          visual_style: "Frosted obsidian with 24k polished gold accents"
        },
        pairB: {
          archetype: "The High-Velocity Competitor",
          theme_category: "High-Octane Adrenaline",
          tone: "Kinetic, explosive, leaderboard-crushing, urgent",
          trigger: "Competitive thrill & fear of missing the peak",
          visual_style: "Deep cobalt with blazing neon orange particle trails"
        }
      };
    } else if (themeMode === "hacker_deal") {
      return {
        pairA: {
          archetype: "The Analytical Life-Hacker",
          theme_category: "Pragmatic Efficiency",
          tone: "Sharp, algorithmic, data-backed shortcuts, frictionless",
          trigger: "Automating results in 30 seconds & smart ROI",
          visual_style: "Cyber cyan typography with live algorithmic ticker"
        },
        pairB: {
          archetype: "The Urgent Deal Hunter",
          theme_category: "Flash Insider Vault",
          tone: "Conspiratorial, insider secret, exclusive drop, high-energy",
          trigger: "Outsmarting the retail markup & exclusive flash savings",
          visual_style: "Crimson ruby with pulsing countdown border"
        }
      };
    } else if (themeMode === "rebel_community") {
      return {
        pairA: {
          archetype: "The Bold Street Rebel",
          theme_category: "Disruptor / Bold Edge",
          tone: "Defiant, trend-setting, unapologetic confidence, raw",
          trigger: "Standing out from the crowd & self-expression",
          visual_style: "High-contrast monochrome with electric hot rose pop"
        },
        pairB: {
          archetype: "The Community Storyteller",
          theme_category: "Belonging & Shared Craft",
          tone: "Authentic, peer-to-peer, heartfelt, grassroots",
          trigger: "Belonging to a passionate circle of enthusiasts",
          visual_style: "Warm sunset amber & terraced community cards"
        }
      };
    } else if (themeMode === "adrenaline_wellness") {
      return {
        pairA: {
          archetype: "The Beast Mode Achiever",
          theme_category: "Adrenaline / Peak PR",
          tone: "Sweat-drenched, high-intensity, personal record crusher",
          trigger: "Endorphin high & crushing personal limits",
          visual_style: "Electric crimson & carbon fiber texture"
        },
        pairB: {
          archetype: "The Mindful Longevity Optimizer",
          theme_category: "Holistic Wellness",
          tone: "Scientific, sustainable, restorative vitality, calm",
          trigger: "Living pain-free with balanced biometric recovery",
          visual_style: "Deep oceanic teal with breathing heart-rate pulse"
        }
      };
    }

    // Auto-Adaptive Mode: Intelligently match to user demographics and interest
    if (cat.includes("coffee") || cat.includes("tea") || cat.includes("beverage")) {
      return {
        pairA: {
          archetype: "The Witty Caffeine Addict",
          theme_category: "Playful Humor",
          tone: "Cheeky, self-aware, conversational, anti-morning struggle",
          trigger: "Relatable humor & immediate dopamine smile",
          visual_style: "Warm espresso tones, bold amber accents, quirky badge"
        },
        pairB: {
          archetype: "The Zen Sensory Connoisseur",
          theme_category: "Mindful / Cozy Calm",
          tone: "Warm, peaceful, meditative, slow-living perfection",
          trigger: "Effortless stress relief & mindful artisan comfort",
          visual_style: "Soft ceramic cream & sage green glassmorphism"
        }
      };
    } else if (cat.includes("game") || cat.includes("rpg") || cat.includes("action") || cat.includes("puzzle")) {
      if (age < 30) {
        return {
          pairA: {
            archetype: "The Witty Troll / Playful Provocateur",
            theme_category: "Meme & Self-Aware Humor",
            tone: "Cheeky, sarcastic, meme-fluent, irreverent",
            trigger: "Humorous callout & peer banter ('Your boss won't notice 5 mins')",
            visual_style: "Electric neon violet & cyber yellow with playful badge"
          },
          pairB: {
            archetype: "The Adrenaline High-Roller",
            theme_category: "High-Velocity Competitive",
            tone: "Explosive, kinetic, leaderboard-crushing",
            trigger: "FOMO & Competitive triumph",
            visual_style: "Dark cobalt blue with pulsing cyan particle glow"
          }
        };
      } else {
        return {
          pairA: {
            archetype: "The Cozy Zen Escapist",
            theme_category: "Relaxing Stress-Relief",
            tone: "Unrushed, satisfying, soothing daily escape",
            trigger: "Decompression after a long workday",
            visual_style: "Gentle pastel dusk gradient with smooth rounded badges"
          },
          pairB: {
            archetype: "The Tactical Mastermind",
            theme_category: "Smart Strategic Mastery",
            tone: "Calculated, rewarding, zero mindless grind",
            trigger: "Intellectual pride & VIP mastery",
            visual_style: "Deep slate with sharp emerald accents"
          }
        };
      }
    } else if (cat.includes("apparel") || cat.includes("fashion") || cat.includes("sneaker") || cat.includes("shopping")) {
      return {
        pairA: {
          archetype: "The Bold Streetwear Rebel",
          theme_category: "Disruptor / Bold Edge",
          tone: "Defiant, trend-setting, unapologetic confidence",
          trigger: "Standing out from the crowd & self-expression",
          visual_style: "High-contrast monochrome with electric neon orange pop"
        },
        pairB: {
          archetype: "The VIP Quiet-Luxury Connoisseur",
          theme_category: "Aspirational Prestige",
          tone: "Understated elegance, timeless craft, effortless comfort",
          trigger: "Discerning taste & lasting value",
          visual_style: "Frosted obsidian with gold wireframe accents"
        }
      };
    } else if (cat.includes("finance") || cat.includes("invest") || cat.includes("crypto") || cat.includes("wealth")) {
      return {
        pairA: {
          archetype: "The Analytical Life-Hacker",
          theme_category: "Pragmatic Efficiency",
          tone: "Sharp, algorithmic, data-backed shortcuts",
          trigger: "Automating money moves in 30 seconds",
          visual_style: "Tech cyan & crisp white typography with data ticker"
        },
        pairB: {
          archetype: "The Sovereign Wealth Guardian",
          theme_category: "Prestige & Security",
          tone: "Calm, institutional-grade, compounding peace of mind",
          trigger: "Downside protection & generational growth",
          visual_style: "Midnight sapphire with emerald prosperity aura"
        }
      };
    } else if (cat.includes("fitness") || cat.includes("health") || cat.includes("gym") || cat.includes("wellness")) {
      return {
        pairA: {
          archetype: "The Unapologetic Beast Mode",
          theme_category: "High-Octane Adrenaline",
          tone: "Sweat-drenched, high-intensity, personal record crusher",
          trigger: "Endorphin high & crushing personal limits",
          visual_style: "Electric crimson & carbon fiber texture"
        },
        pairB: {
          archetype: "The Mindful Longevity Optimizer",
          theme_category: "Holistic Wellness",
          tone: "Scientific, sustainable, restorative vitality",
          trigger: "Living pain-free with balanced biometric recovery",
          visual_style: "Deep oceanic teal with breathing heart-rate pulse"
        }
      };
    } else {
      // General custom categories - pair a Witty/Playful angle with a Mindful/Prestige angle
      return {
        pairA: {
          archetype: "The Witty Provocateur",
          theme_category: "Playful Humor & Direct Hook",
          tone: "Fresh, conversational, delightfully honest, witty",
          trigger: "Breaking the routine with refreshing honesty",
          visual_style: "Vibrant high-contrast electric gradient"
        },
        pairB: {
          archetype: "The Thoughtful Connoisseur",
          theme_category: "Curated Excellence & Zen",
          tone: "Refined, effortless, mindful appreciation",
          trigger: "Genuine craft & unhurried satisfaction",
          visual_style: "Sleek glassmorphism with subtle metallic accents"
        }
      };
    }
  }

  async process(blackboard) {
    blackboard.log("Subagent Persona analyzing psychographics & multi-thematic archetypes", this.id);

    const mathEval = blackboard.state.mathematical_evaluation;
    const topSignals = mathEval.top_weighted_signals || [];
    const userProfile = blackboard.state.inputs.user_profile;
    const adConstraints = blackboard.state.inputs.ad_constraints;
    const slot = adConstraints?.slot || { width: 300, height: 250, name: "Rectangle" };
    const themeMode = adConstraints?.theme_mode || blackboard.state.inputs.theme_mode || "auto";

    const categorySignal = topSignals.find(s => s.signal.includes("Category") || s.signal.includes("Affinity"))?.value || 
                           userProfile.behavioral_signals?.primary_affinity || "General Lifestyle";
    const ltvSignal = userProfile.behavioral_signals?.predicted_ltv_tier || "Mid";
    const userCity = userProfile.demographics?.location?.city || "Metro";
    const userAge = userProfile.demographics?.age || 28;
    const userGender = userProfile.demographics?.gender || "User";
    const appName = userProfile.app_context?.current_app_name || "App Feed";

    // Select dynamic archetypes based on themeMode and user signals
    const selectedPairs = this.selectContrastingArchetypes(userProfile, categorySignal, themeMode);

    // Call Ollama with a streamlined, fast prompt
    const systemPrompt = `You are an expert Ad Copywriter. You write punchy ad copy adhering strictly to persona archetypes. Output ONLY valid JSON with keys "angle_a" and "angle_b".`;

    const userPrompt = `Target User: ${userProfile.name} (${userAge}yo ${userGender}, located in ${userCity})
Primary Affinity/Category: "${categorySignal}"
Monetization Tier: "${ltvSignal}"
Format Slot: ${slot.width}x${slot.height} (${slot.name})

Create 2 contrasting ad angles:

ANGLE A:
- Archetype: ${selectedPairs.pairA.archetype} (${selectedPairs.pairA.theme_category})
- Tone: ${selectedPairs.pairA.tone}
- Headline: Must be under 35 chars, punchy!
- Body: Under 65 chars.
- CTA: Real action verb like "Try Now", "Claim Drop", "Order Fast" (max 14 chars).

ANGLE B:
- Archetype: ${selectedPairs.pairB.archetype} (${selectedPairs.pairB.theme_category})
- Tone: ${selectedPairs.pairB.tone}
- Headline: Must be under 35 chars, completely distinct persona!
- Body: Under 65 chars.
- CTA: Real action verb like "Explore Art", "Savor Calm", "Get VIP Pass" (max 14 chars).

Output ONLY this JSON format:
{
  "angle_a": {
    "headline": "Punchy headline under 35 chars",
    "body": "Body under 65 chars",
    "cta": "Order Now"
  },
  "angle_b": {
    "headline": "Distinct headline under 35 chars",
    "body": "Body under 65 chars",
    "cta": "Explore Calm"
  }
}`;

    let generated = await ollamaService.generateJson(systemPrompt, userPrompt);

    const rawA = generated?.angle_a || {};
    const rawB = generated?.angle_b || {};
    const headA = rawA.headline || rawA.headline_raw;
    const headB = rawB.headline || rawB.headline_raw;

    // Sanitize CTA if LLM returns literal format text
    const cleanCta = (val, defaultVal) => {
      if (!val || typeof val !== "string") return defaultVal;
      if (val.toLowerCase().includes("under") || val.toLowerCase().includes("char")) return defaultVal;
      return val.trim();
    };

    if (!headA || !headB) {
      blackboard.log(`Using rich archetype fallback for ${selectedPairs.pairA.archetype} & ${selectedPairs.pairB.archetype}`, this.id);
      generated = this.buildArchetypeFallback(selectedPairs, categorySignal, userProfile);
    } else {
      blackboard.log(`Ollama llama3.2:1b crafted distinct personalities: "${selectedPairs.pairA.archetype}" & "${selectedPairs.pairB.archetype}"`, this.id, {
        headlineA: headA,
        headlineB: headB
      });
      generated = {
        angle_a: {
          archetype: selectedPairs.pairA.archetype,
          theme_category: selectedPairs.pairA.theme_category,
          tone: selectedPairs.pairA.tone,
          psychological_trigger: selectedPairs.pairA.trigger,
          headline_raw: headA,
          subheadline_raw: rawA.body || rawA.subheadline_raw || `Tailored for ${categorySignal}.`,
          cta_raw: cleanCta(rawA.cta || rawA.cta_raw, "Explore Now")
        },
        angle_b: {
          archetype: selectedPairs.pairB.archetype,
          theme_category: selectedPairs.pairB.theme_category,
          tone: selectedPairs.pairB.tone,
          psychological_trigger: selectedPairs.pairB.trigger,
          headline_raw: headB,
          subheadline_raw: rawB.body || rawB.subheadline_raw || `Personalized for ${categorySignal}.`,
          cta_raw: cleanCta(rawB.cta || rawB.cta_raw, "Claim Access")
        }
      };
    }

    const personaSpec = {
      angle_a: generated.angle_a,
      angle_b: generated.angle_b,
      cross_agent_direction: {
        angle_a_visual_style: selectedPairs.pairA.visual_style,
        angle_b_visual_style: selectedPairs.pairB.visual_style,
        recommended_pacing: "Fast kinetic cuts for Angle A; smooth glide for Angle B"
      }
    };

    blackboard.state.subagent_contributions.persona_spec = personaSpec;
    return personaSpec;
  }

  buildArchetypeFallback(pairs, category, userProfile) {
    const cat = category.toLowerCase();
    const words = category.split(/[,&]/).map(w => w.trim()).filter(Boolean);
    const kw = words[0] || category;

    // Helper to generate copy based on archetype taxonomy
    const generateForArchetype = (pairInfo) => {
      const arch = (pairInfo.archetype || "").toLowerCase();
      const theme = (pairInfo.theme_category || "").toLowerCase();

      if (arch.includes("witty") || theme.includes("humor") || theme.includes("meme")) {
        return {
          headline_raw: `Why Is Most ${kw} So Boring?`,
          subheadline_raw: `Skip the mediocre stuff. Get instant ${kw} perfection before lunch.`,
          cta_raw: "Upgrade Fast"
        };
      } else if (arch.includes("zen") || theme.includes("mindful") || theme.includes("calm")) {
        return {
          headline_raw: `The Art of Mindful ${kw}`,
          subheadline_raw: `Carefully crafted tranquility. Slow down and savor pure ${kw} bliss.`,
          cta_raw: "Find Your Zen"
        };
      } else if (arch.includes("prestige") || theme.includes("luxury") || arch.includes("connoisseur")) {
        return {
          headline_raw: `Uncompromising ${kw} Craft`,
          subheadline_raw: `For those who accept nothing less than bespoke, master-tier excellence.`,
          cta_raw: "Claim Privilege"
        };
      } else if (arch.includes("hacker") || theme.includes("efficiency") || arch.includes("tactical")) {
        return {
          headline_raw: `Optimize Your ${kw} in 30s`,
          subheadline_raw: `Automated smart routines designed to eliminate 90% of the friction.`,
          cta_raw: "Run Shortcut"
        };
      } else if (arch.includes("velocity") || theme.includes("adrenaline") || arch.includes("roller") || arch.includes("beast")) {
        return {
          headline_raw: `Crush Your Peak in ${kw}`,
          subheadline_raw: `Explosive kinetic performance engineered to dominate every milestone.`,
          cta_raw: "Unleash Now"
        };
      } else if (arch.includes("deal") || theme.includes("vault") || theme.includes("drop")) {
        return {
          headline_raw: `Secret ${kw} Drop Unlocked`,
          subheadline_raw: `Private member access: save 40% before the vault closes tonight.`,
          cta_raw: "Unlock Vault"
        };
      } else if (arch.includes("rebel") || theme.includes("disruptor") || theme.includes("bold")) {
        return {
          headline_raw: `Never Blend In With ${kw}`,
          subheadline_raw: `Break the conventional mold. Bold, raw, unapologetic self-expression.`,
          cta_raw: "Break Rules"
        };
      } else if (arch.includes("community") || theme.includes("story") || theme.includes("belonging")) {
        return {
          headline_raw: `Built By ${kw} Enthusiasts`,
          subheadline_raw: `Join 50,000+ passionate creators sharing authentic stories every day.`,
          cta_raw: "Join Circle"
        };
      }

      return {
        headline_raw: `Elevate Your Daily ${kw}`,
        subheadline_raw: `The smarter, beautifully designed way to experience modern ${kw}.`,
        cta_raw: "Explore Now"
      };
    };

    const copyA = generateForArchetype(pairs.pairA);
    const copyB = generateForArchetype(pairs.pairB);

    return {
      angle_a: {
        archetype: pairs.pairA.archetype,
        theme_category: pairs.pairA.theme_category,
        tone: pairs.pairA.tone,
        psychological_trigger: pairs.pairA.trigger,
        headline_raw: copyA.headline_raw,
        subheadline_raw: copyA.subheadline_raw,
        cta_raw: copyA.cta_raw
      },
      angle_b: {
        archetype: pairs.pairB.archetype,
        theme_category: pairs.pairB.theme_category,
        tone: pairs.pairB.tone,
        psychological_trigger: pairs.pairB.trigger,
        headline_raw: copyB.headline_raw,
        subheadline_raw: copyB.subheadline_raw,
        cta_raw: copyB.cta_raw
      }
    };
  }
}
