# AD-CRAFT: AI-Assisted Ad Tracking & Generation Prototype

> **A deterministic Blackboard Multi-Agent Architecture for personalized ad generation, grounded in AppLovin MAX and OpenRTB 2.5 real-time bidding signals.**

---

## 🌟 Executive Overview

This prototype demonstrates how advertising networks and demand-side platforms (DSPs) can generate **hyper-personalized, real-time ad variants** tailored to individual user mindsets while strictly adhering to hardware, bandwidth, and regulatory display constraints.

### Core Architecture Highlights:
- **OpenRTB 2.5 & AppLovin MAX Grounding**: Realistic synthetic bid request streams including demographics, app context, predicted LTV tier, historical CTR, purchase recency, and device specs.
- **Strict Constraint Prioritization**: Environmental constraints (network bandwidth, buffer latency, slot surface area) have absolute priority over creative freedom.
- **Deterministic Feature Weighting**: Mathematical Agent computes signal weights using a multi-factor formula and extracts the **Top 5–10 highest-impact variables**.
- **Blackboard Pattern**: Decoupled multi-agent architecture where agents communicate asynchronously by writing to and reading from shared memory slices.
- **Creative Orchestrator ("Creativation Engine")**: Coordinates 3 specialized subagents (**Subagent Persona**, **Subagent Image**, **Subagent Video**) to synthesize **Two Distinct Ad Variants** (Variant A: High-Action Hook vs Variant B: Aspirational Mastery).
- **Feedback Agent & Score Threshold**: Evaluates both variants against a 100-point rubric; triggers automated revision loops if scores fall below the configurable threshold (default: 85/100).
- **Dedicated Prompts Directory**: All agent system prompts reside in [`prompts/`](file:///c:/Users/Smitesh/Shreya/Projects/AI-%20Assisted%20AD%20tracking/prompts) and can be visually inspected in the codebase or via the web dashboard.

---

## 📁 Project Structure

```
AI- Assisted AD tracking/
├── prompts/                               # Dedicated agent prompts directory
│   ├── mathematical_agent_prompt.txt     # Ingestion & deterministic scoring rules
│   ├── creativation_prompt.txt           # Creative Orchestrator system prompt
│   ├── subagent_persona_prompt.txt       # Persona & psychological angle architect
│   ├── subagent_image_prompt.txt         # Visual layout, palettes & asset specs
│   ├── subagent_video_prompt.txt         # Motion storyboard & bandwidth gatekeeper
│   └── feedback_agent_prompt.txt         # Rubric scoring & threshold gatekeeper
├── src/
│   ├── data/
│   │   ├── synthetic_users.js            # AppLovin / OpenRTB 2.5 user profiles
│   │   └── ad_constraints.js             # Slot dimensions & network profiles
│   ├── blackboard/
│   │   └── blackboard.js                 # Shared blackboard state & event logger
│   ├── agents/
│   │   ├── mathematical_agent.js         # Deterministic constraint & signal engine
│   │   ├── subagent_persona.js           # Subagent: Behavioral & copy angles
│   │   ├── subagent_image.js             # Subagent: Layout & styling architect
│   │   ├── subagent_video.js             # Subagent: Motion script & gatekeeper
│   │   ├── creative_orchestrator.js      # Orchestrator synthesizing 2 variants
│   │   └── feedback_agent.js             # Feedback auditor & threshold reviewer
│   └── pipeline/
│       └── ad_pipeline.js                # Multi-agent loop controller
├── public/
│   ├── index.html                        # Interactive prototype dashboard
│   ├── css/
│   │   └── styles.css                    # Ultra-premium glassmorphic dark theme
│   ├── js/
│   │   ├── app.js                        # Client state & interactive controller
│   │   └── renderer.js                   # Pixel-accurate ad unit visual renderer
│   └── assets/                           # High-res generated ad visuals & SVG
│       ├── ad_gaming.jpg                 # Mobile RPG gaming visual
│       ├── ad_ecommerce.jpg              # Athleisure & sneaker visual
│       ├── ad_fintech.jpg                # Wealth management crystal visual
│       └── ad_fitness.svg                # Biometric runner pulse graphic
├── server.js                             # Standalone Node.js HTTP & API server
├── package.json
└── README.md
```

---

## 🔬 AdTech Data Signals: What Ad Companies Actually Collect

Based on research into **AppLovin MAX**, **The Trade Desk**, **Unity Ads**, and the **IAB OpenRTB 2.5 Specification**, mobile ad networks and DSPs operate on the following key signals:

| Category | OpenRTB Object | Parameter / Field | Prototype Usage |
| :--- | :--- | :--- | :--- |
| **Demographics** | `user.geo`, `device.geo` | City, Metro Tier, Country, Language | Tailors regional idioms, currency, and urban vs suburban context |
| **Monetization** | DSP Custom / `user.data` | Predicted LTV Tier (High, Mid, Low) | Determines whether to show VIP/prestige perks vs free trial/discount hooks |
| **Engagement** | Internal DSP / AXON | Historical CTR & CVR | High CTR users receive interactive challenges; low CTR users receive clear utility |
| **Purchase Velocity** | In-App Event Stream | Days Since Last In-App Purchase (IAP) | Active spenders receive limited-edition cross-sells; lapsed users receive win-back coupons |
| **Host Context** | `app.cat`, `app.bundle` | Publisher App Category & Name | Aligns ad aesthetic with the host app to avoid intrusive visual shock |
| **Temporal Context** | Bid Timestamp | Dayparting (Morning / Commute / Evening) | Morning = productivity & utility; Evening = entertainment & casual gaming |
| **Network Buffer** | `device.connectiontype` | Bandwidth (Mbps), RTT Latency (ms) | **Hard Gate**: Prohibits video streaming when bandwidth < 1.5 Mbps to avoid bounce |
| **Slot Dimensions** | `imp.banner` / `imp.video` | Width x Height (300x250, 320x50, 360x640) | Enforces character count bounds on headlines, body copy, and CTA buttons |

---

## 🧮 Mathematical Agent: Deterministic Prioritization & Scoring

The **Mathematical Agent** executes before any creative reasoning occurs:

### 1. Hard Priority Constraints
1. **Network Buffer & Latency Gate**:
   $$\text{If } \text{Speed} < 1.5\text{ Mbps or Buffer Latency} > 300\text{ms} \implies \text{Format} = \text{STATIC\_IMAGE (Max 180 KB)}$$
   $$\text{If } \text{Speed} \ge 5.0\text{ Mbps and Low Latency} \implies \text{Format} = \text{VIDEO\_RICH\_MEDIA (Max 2.5 MB)}$$
2. **Display Dimensions & Surface Area**:
   - `320x50 Banner`: Headline $\le 24$ chars, CTA $\le 12$ chars, Body $= 0$ chars.
   - `300x250 MREC`: Headline $\le 42$ chars, Body $\le 80$ chars, CTA $\le 16$ chars.
   - `360x640 Interstitial`: Headline $\le 60$ chars, Body $\le 140$ chars, CTA $\le 20$ chars.

### 2. Signal Weighting Function
$$W_i = \text{BaseRelevance}_i \times \text{Confidence}_i \times \text{RecencyMultiplier}_i \times \text{LTVFactor}_i$$

The agent evaluates all 15+ incoming signals, sorts them in descending order, and extracts the **Top 5 to 10 Highest-Weighted Personalization Variables**, posting them to `blackboard.mathematical_evaluation`.

---

## 🎨 Creative Agent Orchestration & The 3 Subagents

The **Creative Agent Orchestrator** ("Creativation Engine") directs 3 specialized subagents:

1. **Subagent Persona** ([`subagent_persona_prompt.txt`](file:///c:/Users/Smitesh/Shreya/Projects/AI-%20Assisted%20AD%20tracking/prompts/subagent_persona_prompt.txt)):
   - Analyzes top weighted signals.
   - Produces **Angle A** (High-energy, competitive urgency, FOMO) and **Angle B** (Calculated mastery, social proof, aspirational utility).
2. **Subagent Image** ([`subagent_image_prompt.txt`](file:///c:/Users/Smitesh/Shreya/Projects/AI-%20Assisted%20AD%20tracking/prompts/subagent_image_prompt.txt)):
   - Defines color theory, gradients, contrast ratios, and visual asset mappings.
   - Strictly adapts composition to slot dimensions.
3. **Subagent Video** ([`subagent_video_prompt.txt`](file:///c:/Users/Smitesh/Shreya/Projects/AI-%20Assisted%20AD%20tracking/prompts/subagent_video_prompt.txt)):
   - **Bandwidth Gatekeeper**: If network constraints forbid video, immediately gates execution with an explicit diagnostic notice.
   - If video is permitted, drafts 3-second hook, scene transitions, and audio directions.

The Orchestrator synthesizes **Two Distinct Ad Variants**:
- **Variant A**: Fast-Action Achiever (Urgent Hook, high-contrast visual, bold CTA).
- **Variant B**: Strategic Mastermind (Aspirational Hook, glassmorphic palette, refined CTA).

---

## 🛡️ Feedback Agent & Score Threshold Gatekeeping

The **Feedback Agent** ([`feedback_agent_prompt.txt`](file:///c:/Users/Smitesh/Shreya/Projects/AI-%20Assisted%20AD%20tracking/prompts/feedback_agent_prompt.txt)) audits proposals against a 100-point deterministic rubric:

| Dimension | Weight | Criteria |
| :--- | :--- | :--- |
| **Constraint Adherence** | 35 pts | Character counts within slot limit; media type complies with network speed |
| **Personalization Fidelity** | 30 pts | Direct reflection of top 5–10 signals in copy and strategy |
| **Creative Differentiation** | 20 pts | Clear psychological divergence between Variant A and Variant B |
| **Safety & Brand Integrity** | 15 pts | Non-deceptive claims; COPPA compliance; clear CTA tap zone |

- **Threshold Check**: If $\text{Composite Score} \ge \text{Threshold}$ (e.g. 85.0), the status is marked **APPROVED**.
- If $\text{Composite Score} < \text{Threshold}$, the agent issues specific revision feedback and triggers a refinement iteration in the Blackboard loop.

---

## 🚀 Running the Prototype Locally

The project runs on native Node.js (v18+) with **zero external package installations required**.

```bash
# Navigate to the project directory
cd "c:\Users\AI- Assisted AD tracking"

# Start the server
node server.js
```

Open your browser to:
👉 **`http://localhost:3000`**

### Available Interactive Features:
1. **Profile Selector**: Switch between Gaming, E-Commerce, FinTech, and Fitness personas.
2. **Constraint Toggles**: Change ad slots (MREC, Mobile Banner, Fullscreen Interstitial) and network conditions (5G, 4G, 3G Slow Buffer).
3. **Score Threshold Slider**: Dynamically adjust acceptance criteria from 70 to 95.
4. **Live Ad Previews**: See pixel-accurate ad renderings with interactive buttons and explainability tags.
5. **System Prompts Inspector**: Read all 6 prompt files in the bottom drawer.
6. **Blackboard JSON Viewer**: Inspect real-time multi-agent memory slices.
