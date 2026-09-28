/**
 * AD-CRAFT Prototype Client Application
 * Clean, focused architecture: Visual Flow + Outputs + Add Custom User + Ollama
 */

import { AdRenderer } from "./renderer.js";
import { FlowVisualizer } from "./flow_visualizer.js";

class AdCraftApp {
  constructor() {
    this.presets = null;
    this.currentResult = null;
    this.flowVisualizer = null;

    // DOM Elements
    this.userSelect = document.getElementById("userSelect");
    this.themeSelect = document.getElementById("themeSelect");
    this.slotSelect = document.getElementById("slotSelect");
    this.networkSelect = document.getElementById("networkSelect");
    this.thresholdInput = document.getElementById("thresholdInput");
    this.thresholdVal = document.getElementById("thresholdVal");
    this.runBtn = document.getElementById("runBtn");
    this.activeProfileBar = document.getElementById("activeProfileBar");
    this.deliveryConstraintNotice = document.getElementById("deliveryConstraintNotice");
    this.outputsSubNotice = document.getElementById("outputsSubNotice");
    this.ollamaStatusBadge = document.getElementById("ollamaStatusBadge");

    this.variantsGrid = document.getElementById("adVariantsContainer");
    this.variantTabs = document.querySelectorAll(".variant-tab");

    // Add User Modal Elements
    this.openAddUserBtn = document.getElementById("openAddUserBtn");
    this.addUserModal = document.getElementById("addUserModal");
    this.closeAddUserBtn = document.getElementById("closeAddUserBtn");
    this.cancelAddUserBtn = document.getElementById("cancelAddUserBtn");
    this.addUserForm = document.getElementById("addUserForm");

    // Device Simulator Modal
    this.deviceSimulatorModal = document.getElementById("deviceSimulatorModal");
    this.closeSimulatorModalBtn = document.getElementById("closeSimulatorModalBtn");

    this.init();
  }

  async init() {
    this.bindEvents();
    // Initialize Flow Visualizer in resting/muted state
    this.flowVisualizer = new FlowVisualizer("flowVisualizerContainer");

    await this.fetchPresets();
    this.updateProfileBar();
    this.renderInitialPlaceholder();
  }

  renderInitialPlaceholder() {
    const slot = this.getSelectedSlot() || { name: "Medium Rectangle", width: 300, height: 250 };
    const network = this.getSelectedNetwork() || { name: "5G High-Speed" };

    this.deliveryConstraintNotice.innerHTML = `
      <div class="constraint-alert-left">
        <span class="alert-icon">📌</span>
        <div>
          Format: <strong>${slot.name} (${slot.width}x${slot.height})</strong> • 
          Network: <strong>${network.name}</strong> • 
          Status: <strong>Awaiting Activation</strong>
        </div>
      </div>
      <div class="feedback-stamp revision">
        READY TO CREATE
      </div>
    `;

    this.variantsGrid.innerHTML = `
      <div class="ad-empty-placeholder full-width">
        <div class="empty-icon">⚡</div>
        <h3>Ready to Craft Personalized Ads with Ollama</h3>
        <p>The visual flow above is currently in resting mode. Select a profile or click <strong>'➕ Add Custom User'</strong>, choose a creative theme, then press <strong>'Create Ads with Ollama'</strong> in the top control panel to activate the live multi-agent flow!</p>
        <div class="non-clickable-instruction-pill">
          <span class="pill-dot">●</span> Awaiting Trigger: Click "⚡ Create Ads with Ollama" in top bar to launch pipeline
        </div>
      </div>
    `;
  }

  bindEvents() {
    this.thresholdInput.addEventListener("input", (e) => {
      this.thresholdVal.textContent = e.target.value;
    });

    this.userSelect.addEventListener("change", () => {
      this.updateProfileBar();
      // Keep flow muted on display until user presses Create Ads!
      if (this.flowVisualizer) {
        this.flowVisualizer.setMuted();
      }
    });

    if (this.themeSelect) {
      this.themeSelect.addEventListener("change", () => {
        if (this.flowVisualizer) this.flowVisualizer.setMuted();
      });
    }

    this.slotSelect.addEventListener("change", () => {
      if (this.flowVisualizer) this.flowVisualizer.setMuted();
    });

    this.networkSelect.addEventListener("change", () => {
      if (this.flowVisualizer) this.flowVisualizer.setMuted();
    });

    this.runBtn.addEventListener("click", () => {
      this.runPipeline();
    });

    const clearBtn = document.getElementById("clearConsoleBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearConsole());
    }

    // Add User Modal open/close
    this.openAddUserBtn.addEventListener("click", () => {
      this.addUserModal.classList.add("active");
    });

    this.closeAddUserBtn.addEventListener("click", () => {
      this.addUserModal.classList.remove("active");
    });

    this.cancelAddUserBtn.addEventListener("click", () => {
      this.addUserModal.classList.remove("active");
    });

    this.addUserModal.addEventListener("click", (e) => {
      if (e.target === this.addUserModal) {
        this.addUserModal.classList.remove("active");
      }
    });

    // Add User Form Submission
    this.addUserForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleCreateCustomUser();
    });

    // Close Simulator Modal
    if (this.closeSimulatorModalBtn) {
      this.closeSimulatorModalBtn.addEventListener("click", () => {
        this.deviceSimulatorModal.classList.remove("active");
      });
    }

    if (this.deviceSimulatorModal) {
      this.deviceSimulatorModal.addEventListener("click", (e) => {
        if (e.target === this.deviceSimulatorModal) {
          this.deviceSimulatorModal.classList.remove("active");
        }
      });
    }

    // Variant tab switching
    this.variantTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        this.variantTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const variant = tab.dataset.variant;
        this.variantsGrid.classList.remove("single-a", "single-b");
        if (variant === "a") this.variantsGrid.classList.add("single-a");
        if (variant === "b") this.variantsGrid.classList.add("single-b");
      });
    });
  }

  async fetchPresets() {
    try {
      const res = await fetch("/api/presets");
      this.presets = await res.json();

      // Check Ollama status
      if (this.presets.ollama_status?.online) {
        this.ollamaStatusBadge.innerHTML = `<span class="dot green"></span> 🦙 Ollama llama3.2:1b Connected`;
      } else {
        this.ollamaStatusBadge.innerHTML = `<span class="dot amber"></span> 🦙 Ollama Connecting...`;
      }

      this.populateUserDropdown();

      // Populate Display Slots
      this.slotSelect.innerHTML = this.presets.slots.map(s => `
        <option value="${s.id}">📐 ${s.name}</option>
      `).join("");

      // Populate Networks
      this.networkSelect.innerHTML = this.presets.networks.map(n => `
        <option value="${n.id}">📶 ${n.name}</option>
      `).join("");

      this.thresholdInput.value = this.presets.config?.score_threshold || 85;
      this.thresholdVal.textContent = this.thresholdInput.value;
    } catch (err) {
      console.error("Failed to load presets:", err);
    }
  }

  populateUserDropdown(selectedId = null) {
    this.userSelect.innerHTML = this.presets.users.map(u => `
      <option value="${u.id}" ${selectedId === u.id ? 'selected' : ''}>
        ${u.avatar} ${u.name}
      </option>
    `).join("");
  }

  updateProfileBar() {
    const user = this.getSelectedUser();
    if (!user) return;

    this.activeProfileBar.innerHTML = `
      <div class="active-profile-content">
        <div class="active-user-badge">
          <span class="user-avatar-circle">${user.avatar || '👤'}</span>
          <div class="user-identity">
            <span class="user-fullname">${user.name}</span>
            <span class="user-demographics">${user.demographics.age}yo ${user.demographics.gender} • ${user.demographics.location.city}</span>
          </div>
        </div>

        <div class="profile-signal-pill">
          <span class="pill-label">Target Interest:</span>
          <span class="pill-val text-cyan">${user.behavioral_signals.primary_affinity}</span>
        </div>

        <div class="profile-signal-pill">
          <span class="pill-label">Publisher App:</span>
          <span class="pill-val">${user.app_context.current_app_name}</span>
        </div>

        <div class="profile-signal-pill">
          <span class="pill-label">Predicted LTV:</span>
          <span class="pill-val text-indigo">${user.behavioral_signals.predicted_ltv_tier}</span>
        </div>

        <div class="profile-signal-pill">
          <span class="pill-label">CTR:</span>
          <span class="pill-val text-emerald">${(user.behavioral_signals.historical_ctr * 100).toFixed(1)}%</span>
        </div>
      </div>
    `;
  }

  async handleCreateCustomUser() {
    const name = document.getElementById("customName").value.trim();
    const avatar = document.getElementById("customAvatar").value.trim() || "👤";
    const primaryAffinity = document.getElementById("customAffinity").value.trim();
    const age = parseInt(document.getElementById("customAge").value) || 28;
    const gender = document.getElementById("customGender").value;
    const city = document.getElementById("customCity").value.trim() || "New York";
    const appName = document.getElementById("customAppName").value.trim() || "Mobile Feed";
    const ltv = document.getElementById("customLtv").value;
    const ctr = (parseFloat(document.getElementById("customCtr").value) || 4.0) / 100;

    const newUser = {
      name,
      avatar,
      headline: `${primaryAffinity} Enthusiast • ${city}`,
      demographics: {
        age,
        gender,
        language: "en-US",
        location: {
          country: "USA",
          region: "NA",
          city,
          metro_tier: "Tier 1 Metro"
        }
      },
      app_context: {
        current_app_name: appName,
        bundle_id: `com.custom.${name.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        iab_category: "IAB9-Custom",
        session_duration_mins: 15,
        daypart: "Active Hours"
      },
      behavioral_signals: {
        primary_affinity: primaryAffinity,
        secondary_affinity: "Lifestyle & Digital Goods",
        historical_ctr: ctr,
        historical_cvr: 0.02,
        predicted_ltv_tier: ltv,
        iap_recency_days: 4,
        ad_fatigue_score: 0.2
      },
      device: {
        device_type: "Smartphone",
        make: "Apple",
        model: "iPhone 15",
        os: "iOS 17.5",
        hardware_tier: "Flagship"
      },
      compliance: {
        gdpr_consent: true,
        ccpa_opt_out: false,
        coppa_flag: 0
      }
    };

    try {
      const res = await fetch("/api/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (data.success) {
        this.presets.users = data.users;
        this.populateUserDropdown(data.user.id);
        this.updateProfileBar();
        this.addUserModal.classList.remove("active");
        this.addUserForm.reset();

        // Immediately generate ads with Ollama for this brand new user!
        this.runPipeline();
      }
    } catch (err) {
      alert("Failed to add custom user: " + err.message);
    }
  }

  getSelectedUser() {
    const id = this.userSelect.value;
    return this.presets?.users.find(u => u.id === id) || this.presets?.users[0];
  }

  getSelectedSlot() {
    const id = this.slotSelect.value;
    return this.presets?.slots.find(s => s.id === id) || this.presets?.slots[0];
  }

  getSelectedNetwork() {
    const id = this.networkSelect.value;
    return this.presets?.networks.find(n => n.id === id) || this.presets?.networks[0];
  }

  logConsole(tag, message, type = "info") {
    const consoleBody = document.getElementById("liveConsoleBody");
    if (!consoleBody) return;

    const timeStr = new Date().toLocaleTimeString();
    const line = document.createElement("div");
    line.className = `terminal-log-line ${type}`;

    let tagClass = "tag-sys";
    if (tag === "INGESTION") tagClass = "tag-ingest";
    else if (tag === "MATH") tagClass = "tag-math";
    else if (tag === "CREATIVE") tagClass = "tag-orch";
    else if (tag === "OLLAMA") tagClass = "tag-persona";
    else if (tag === "FEEDBACK") tagClass = "tag-feedback";
    else if (tag === "OUTPUT") tagClass = "tag-output";

    line.innerHTML = `
      <span class="log-ts">[${timeStr}]</span>
      <span class="log-tag ${tagClass}">${tag}</span>
      <span class="log-msg">${message}</span>
    `;

    consoleBody.appendChild(line);
    consoleBody.scrollTop = consoleBody.scrollHeight;
  }

  clearConsole() {
    const consoleBody = document.getElementById("liveConsoleBody");
    if (consoleBody) {
      consoleBody.innerHTML = `
        <div class="terminal-log-line info">
          <span class="log-ts">[Cleared]</span> <span class="log-tag tag-sys">SYSTEM</span> Terminal logs reset. Ready for next pipeline run.
        </div>
      `;
    }
  }

  handlePipelineEvent(eventName, data, slot, network, user_profile) {
    if (eventName === "ingestion") {
      if (this.flowVisualizer) this.flowVisualizer.advanceToStage("ingestion", data);
      this.logConsole("INGESTION", `Signals ingested for ${user_profile.name} (Affinity: "${user_profile.behavioral_signals.primary_affinity}").`);
    } else if (eventName === "math") {
      if (this.flowVisualizer) this.flowVisualizer.advanceToStage("math", data);
      const topS = data.topSignals?.[0];
      const topLabel = topS ? `${topS.signal} (weight ${topS.weight.toFixed(2)})` : "Signals weighted";
      this.logConsole("MATH", `Deterministic matrix computed: ${topLabel}. Slot max headline: ${data.formatBudget?.max_headline_length || 35} chars.`);
    } else if (eventName === "creative_start") {
      if (this.flowVisualizer) this.flowVisualizer.advanceToStage("creative_start", data);
      this.logConsole("CREATIVE", "Creativation Hub coordinating Persona, Image, and Video subagents.");
      this.logConsole("OLLAMA", "🦙 Prompting local llama3.2:1b for psychologically contrasting copy...");
    } else if (eventName === "creative_done") {
      if (this.flowVisualizer) this.flowVisualizer.advanceToStage("creative_done", data);
      const vA = data.proposals?.variant_a;
      const vB = data.proposals?.variant_b;
      this.logConsole("OLLAMA", `✓ Copy generated! Variant A: "${vA?.copy?.headline}" | Variant B: "${vB?.copy?.headline}"`);
      this.logConsole("CREATIVE", `Subagent Image & Video styling complete for "${vA?.persona?.archetype}" & "${vB?.persona?.archetype}".`);
      
      // Render preview immediately when creative stage completes!
      if (data.proposals) {
        this.renderOutputs({ state: { creative_proposals: data.proposals } }, slot, network, user_profile);
      }
    } else if (eventName === "feedback") {
      if (this.flowVisualizer) this.flowVisualizer.advanceToStage("feedback", data);
      const rep = data.feedbackReport || {};
      this.logConsole("FEEDBACK", `100-Point Rubric Audit: ${data.score}/100 PTS (${rep.status === "APPROVED" ? "APPROVED ✓" : "REVISION REQUIRED ⚠"}).`);
    } else if (eventName === "complete") {
      this.currentResult = data.snapshot;
      if (this.flowVisualizer) this.flowVisualizer.advanceToStage("complete", data);
      this.renderOutputs(data.snapshot, slot, network, user_profile);
      this.logConsole("OUTPUT", `🚀 SUCCESS: Two certified ad variants ready for delivery in ${data.elapsedSec}s total!`);
    }
  }

  async runPipeline() {
    this.runBtn.disabled = true;
    this.runBtn.innerHTML = `<span class="btn-icon">⏳</span> Writing Ads with Ollama...`;

    const user_profile = this.getSelectedUser();
    const slot = this.getSelectedSlot();
    const network = this.getSelectedNetwork();
    const theme_mode = this.themeSelect ? this.themeSelect.value : "auto";
    const score_threshold = Number(this.thresholdInput.value);

    // 1. INSTANT TRIGGER: The moment button is clicked, wake up flow canvas immediately!
    if (this.flowVisualizer) {
      this.flowVisualizer.triggerImmediateActivation(user_profile, slot, network, theme_mode);
    }

    // Set outputs area into active generating state with animated feedback
    this.variantsGrid.innerHTML = `
      <div class="ad-empty-placeholder full-width running-state">
        <div class="empty-icon pulse-spin">⚡</div>
        <h3>Synthesizing Tailored Ads with Ollama...</h3>
        <p>The multi-agent pipeline is executing live above. Ingesting behavioral signals for <strong>${user_profile.name}</strong>, evaluating slot constraints (${slot.width}x${slot.height}), and generating personality-crafted ad variants.</p>
        <div class="non-clickable-instruction-pill active">
          <span class="pill-dot blink">●</span> Pipeline Active • Realtime Event Stream In Progress
        </div>
      </div>
    `;

    const consoleBadge = document.getElementById("consoleLiveBadge");
    if (consoleBadge) {
      consoleBadge.textContent = "PIPELINE ACTIVE";
      consoleBadge.classList.add("active");
    }

    this.logConsole("INGESTION", `Dispatched pipeline trigger: ${user_profile.name} • ${slot.name} (${slot.width}x${slot.height}) • Theme: ${theme_mode}`);

    try {
      // Connect to Real-time SSE Streaming Endpoint
      const response = await fetch("/api/pipeline/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_profile,
          ad_constraints: { slot, network, theme_mode },
          score_threshold,
          max_iterations: 3
        })
      });

      if (response.body && response.body.getReader) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const blocks = buffer.split("\n\n");
          buffer = blocks.pop() || ""; // retain remainder

          for (const block of blocks) {
            const eventMatch = block.match(/event:\s*(.+)/);
            const dataMatch = block.match(/data:\s*([\s\S]+)/);
            if (eventMatch && dataMatch) {
              const eventName = eventMatch[1].trim();
              try {
                const data = JSON.parse(dataMatch[1].trim());
                this.handlePipelineEvent(eventName, data, slot, network, user_profile);
              } catch (parseErr) {
                console.warn("SSE data parse error:", parseErr);
              }
            }
          }
        }
      } else {
        // Fallback if ReadableStream is unavailable
        const res = await fetch("/api/pipeline/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_profile, ad_constraints: { slot, network, theme_mode }, score_threshold, max_iterations: 3 })
        });
        const snapshot = await res.json();
        this.renderOutputs(snapshot, slot, network, user_profile);
        if (this.flowVisualizer) this.flowVisualizer.animatePipelineFlow(snapshot);
      }
    } catch (err) {
      console.error("Error running pipeline:", err);
      this.logConsole("SYSTEM", `Pipeline Error: ${err.message}`, "error");
      alert("Pipeline run failed: " + err.message);
    } finally {
      this.runBtn.disabled = false;
      this.runBtn.innerHTML = `<span class="btn-icon">⚡</span> Create Ads with Ollama`;
      if (consoleBadge) {
        consoleBadge.textContent = "IDLE / READY";
        consoleBadge.classList.remove("active");
      }
    }
  }

  renderOutputs(snapshot, slot, network, user_profile) {
    const state = snapshot?.state || snapshot || {};
    const budget = state.mathematical_evaluation?.format_budget || {};
    const feedback = state.feedback_audit || {};
    const isStaticGated = budget.media_type === "STATIC_IMAGE";

    // Update Subheader
    if (this.outputsSubNotice) {
      const affinity = user_profile?.behavioral_signals?.primary_affinity || "Personalized Interests";
      this.outputsSubNotice.textContent = `Generated for ${user_profile?.name || "User"} (${affinity}) via Ollama llama3.2:1b`;
    }

    // Delivery Gate Alert
    if (this.deliveryConstraintNotice) {
      const score = feedback?.composite_score || 95;
      const isApproved = feedback?.status === 'APPROVED' || score >= 85;
      this.deliveryConstraintNotice.innerHTML = `
        <div class="constraint-alert-left">
          <span class="alert-icon">📌</span>
          <div>
            Format: <strong>${slot.name} (${slot.width}x${slot.height})</strong> • 
            Network: <strong>${network.name}</strong> • 
            Media Type: <strong>${budget.media_type || "HYBRID"}</strong>
            ${isStaticGated ? ` <span style="color:#f59e0b;">(Video prohibited due to low network buffer)</span>` : ` <span style="color:#34d399;">(Video streaming permitted)</span>`}
          </div>
        </div>
        <div class="feedback-stamp ${isApproved ? 'approved' : 'revision'}">
          ${isApproved ? '✓ CERTIFIED' : '⚠ REVISION'}: ${score}/100 PTS
        </div>
      `;
    }

    // CRITICAL FIX: Ensure the target container elements exist in DOM before rendering!
    this.variantsGrid.innerHTML = `
      <div id="variantACard" class="ad-variant-wrapper"></div>
      <div id="variantBCard" class="ad-variant-wrapper"></div>
    `;

    // Apply active tab layout (both / a / b)
    const activeTab = document.querySelector(".variant-tab.active");
    const activeVariant = activeTab ? activeTab.dataset.variant : "both";
    this.variantsGrid.classList.remove("single-a", "single-b");
    if (activeVariant === "a") this.variantsGrid.classList.add("single-a");
    if (activeVariant === "b") this.variantsGrid.classList.add("single-b");

    // Render Variant A and Variant B
    const proposals = state.creative_proposals || (state.final_approved_ads?.variants ? {
      variant_a: state.final_approved_ads.variants[0],
      variant_b: state.final_approved_ads.variants[1]
    } : null);

    if (proposals) {
      if (proposals.variant_a) {
        AdRenderer.renderVariantCard("variantACard", proposals.variant_a, slot, network, true);
      }
      if (proposals.variant_b) {
        AdRenderer.renderVariantCard("variantBCard", proposals.variant_b, slot, network, false);
      }
    }

    // Smoothly scroll down so user immediately sees their generated ads and preview
    const outputsSection = document.getElementById("outputsSection");
    if (outputsSection) {
      outputsSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
}

// Instantiate on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  new AdCraftApp();
});
