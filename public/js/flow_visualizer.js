/**
 * Interactive Visual Pipeline Flow Engine
 * Renders an animated node graph with live data flow paths.
 * When idle/just on display: Muted, subtle colors.
 * When activated by 'Create Ads': Lights up with vibrant neon beams, traveling particles,
 * and kinetic agent step animations!
 */

export class FlowVisualizer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      autoPlay: false,
      animationSpeed: 1.0, // 1x
      onNodeSelect: null,
      ...options
    };
    this.activeStage = null;
    this.stages = ["ingestion", "math", "orchestrator", "subagents", "feedback", "output"];
    this.pipelineData = null;
    this.isPlaying = false;
    this.renderGraph();
  }

  /**
   * Render the visual flow diagram structure into container
   */
  renderGraph() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="flow-wrapper">
        <!-- Top Toolbar -->
        <div class="flow-toolbar">
          <div class="flow-status-indicator">
            <span class="flow-radar-dot" id="flowRadarDot"></span>
            <span id="flowStatusLabel" class="flow-status-text">Pipeline Idle • Ready to Activate</span>
          </div>
          <div class="flow-controls">
            <button id="flowPlayBtn" class="btn btn-sm btn-outline" title="Replay Flow Animation">
              <span>▶</span> Replay Flow
            </button>
            <div class="speed-selector">
              <span class="speed-label">Speed:</span>
              <button class="speed-btn active" data-speed="1">1x</button>
              <button class="speed-btn" data-speed="1.5">1.5x</button>
              <button class="speed-btn" data-speed="2">2x</button>
            </div>
          </div>
        </div>

        <!-- Flow Canvas Area (Defaults to Muted State) -->
        <div class="flow-canvas-container muted-flow" id="flowCanvasContainer">
          <!-- SVG Connecting Arrows Layer -->
          <svg class="flow-svg-layer" id="flowSvgLayer" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- Linear Glow Gradients for Flow Lines -->
              <linearGradient id="cyanIndigoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#6366f1" />
              </linearGradient>
              <linearGradient id="indigoAmberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#6366f1" />
                <stop offset="100%" stop-color="#f59e0b" />
              </linearGradient>
              <linearGradient id="amberEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f59e0b" />
                <stop offset="100%" stop-color="#10b981" />
              </linearGradient>
              <linearGradient id="emeraldOutputGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#10b981" />
                <stop offset="100%" stop-color="#38bdf8" />
              </linearGradient>

              <!-- Neon Glow Filters -->
              <filter id="neonFlowCyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <!-- Dynamic Paths Group (Generated in JS) -->
            <g id="flowPathsGroup"></g>
          </svg>

          <!-- Interactive Node Cards Grid -->
          <div class="flow-nodes-layout">
            <!-- Stage 1: Data Ingestion Node -->
            <div class="flow-node node-ingestion" id="node-ingestion" data-stage="ingestion">
              <div class="node-header">
                <span class="node-badge">1. INGESTION</span>
                <span class="node-radar-icon">📡</span>
              </div>
              <div class="node-body">
                <div class="node-title">AdTech Signals</div>
                <div class="node-meta" id="flowIngestionMeta">OpenRTB 2.5 Stream</div>
                <div class="node-chips-preview">
                  <span class="chip-sm">Demographics</span>
                  <span class="chip-sm">pLTV</span>
                  <span class="chip-sm">CTR</span>
                  <span class="chip-sm">Buffer</span>
                </div>
              </div>
              <div class="node-pulse-ring"></div>
            </div>

            <!-- Stage 2: Mathematical Agent Node -->
            <div class="flow-node node-math" id="node-math" data-stage="math">
              <div class="node-header">
                <span class="node-badge badge-math">2. MATH AGENT</span>
                <span class="node-radar-icon">🧮</span>
              </div>
              <div class="node-body">
                <div class="node-title">Deterministic Weights</div>
                <div class="node-meta">Prioritize Constraints</div>
                <div class="math-matrix-viz" id="flowMathViz">
                  <div class="matrix-bar" style="width: 95%;"></div>
                  <div class="matrix-bar" style="width: 82%;"></div>
                  <div class="matrix-bar" style="width: 71%;"></div>
                </div>
                <div class="node-tag-highlight" id="flowMathTag">Extracting Top Signals</div>
              </div>
              <div class="node-pulse-ring"></div>
            </div>

            <!-- Stage 3: Creative Orchestrator Hub & 3 Subagents Cluster -->
            <div class="flow-cluster" id="cluster-creative">
              <!-- Central Hub -->
              <div class="flow-node node-orchestrator" id="node-orchestrator" data-stage="orchestrator">
                <div class="node-header">
                  <span class="node-badge badge-orch">3. CREATIVE HUB</span>
                  <span class="node-radar-icon">⚡</span>
                </div>
                <div class="node-body">
                  <div class="node-title">Creativation Engine</div>
                  <div class="node-meta">Coordinates 3 Subagents</div>
                </div>
                <div class="node-pulse-ring"></div>
              </div>

              <!-- 3 Subagents Branching Column -->
              <div class="subagents-branch-group">
                <!-- Subagent A: Persona -->
                <div class="subagent-node node-persona" id="node-subagent-persona" data-stage="subagents">
                  <div class="subagent-icon-wrap">
                    <span class="subagent-icon">🎭</span>
                    <div class="brainwave-anim">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                  <div class="subagent-info">
                    <div class="subagent-name">Subagent Persona</div>
                    <div class="subagent-desc" id="flowPersonaDesc">8-Archetype Psychographics</div>
                  </div>
                </div>

                <!-- Subagent B: Image -->
                <div class="subagent-node node-image" id="node-subagent-image" data-stage="subagents">
                  <div class="subagent-icon-wrap">
                    <span class="subagent-icon">🎨</span>
                    <div class="palette-swatch-anim">
                      <div class="swatch-dot amber"></div>
                      <div class="swatch-dot emerald"></div>
                      <div class="swatch-dot cyan"></div>
                    </div>
                  </div>
                  <div class="subagent-info">
                    <div class="subagent-name">Subagent Image</div>
                    <div class="subagent-desc" id="flowImageDesc">Visual Themes & Palettes</div>
                  </div>
                </div>

                <!-- Subagent C: Video -->
                <div class="subagent-node node-video" id="node-subagent-video" data-stage="subagents">
                  <div class="subagent-icon-wrap">
                    <span class="subagent-icon">🎬</span>
                    <div class="equalizer-anim">
                      <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                    </div>
                  </div>
                  <div class="subagent-info">
                    <div class="subagent-name">Subagent Video</div>
                    <div class="subagent-desc" id="flowVideoDesc">3s Hook & Bandwidth Gating</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stage 4: Feedback Agent Quality Gatekeeper Node -->
            <div class="flow-node node-feedback" id="node-feedback" data-stage="feedback">
              <div class="node-header">
                <span class="node-badge badge-feedback">4. FEEDBACK AGENT</span>
                <span class="node-radar-icon">🛡️</span>
              </div>
              <div class="node-body">
                <div class="node-title">Quality Gatekeeper</div>
                <div class="feedback-gauge-wrap">
                  <div class="gauge-bar-bg">
                    <div class="gauge-bar-fill" id="flowGaugeFill" style="width: 0%;"></div>
                  </div>
                  <div class="gauge-label" id="flowGaugeLabel">Auditing...</div>
                </div>
                <div class="node-status-pill" id="flowAuditPill">Threshold 85</div>
              </div>
              <div class="node-pulse-ring"></div>
            </div>

            <!-- Stage 5: Final Ad Previews Node -->
            <div class="flow-node node-output" id="node-output" data-stage="output">
              <div class="node-header">
                <span class="node-badge badge-output">5. AD OUTPUTS</span>
                <span class="node-radar-icon">📱</span>
              </div>
              <div class="node-body">
                <div class="node-title">Two Ad Variants</div>
                <div class="node-meta">Ollama LLM Certified</div>
                <div class="output-preview-mini" id="flowOutputMini">
                  <div class="mini-tag tag-a">⚡ Variant A</div>
                  <div class="mini-tag tag-b">✦ Variant B</div>
                </div>
              </div>
              <div class="node-pulse-ring"></div>
            </div>
          </div>
        </div>

        <!-- Node Live Telemetry Bar -->
        <div class="flow-telemetry-bar" id="flowTelemetryBar">
          <div class="telemetry-item">
            <span class="telemetry-label">Pipeline State:</span>
            <span class="telemetry-val text-cyan" id="telemetryStageVal">Displaying (Muted)</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-label">Active Flow:</span>
            <span class="telemetry-val" id="telemetryDataVal">Awaiting 'Generate Ads'</span>
          </div>
          <div class="telemetry-item">
            <span class="telemetry-label">Audited Score:</span>
            <span class="telemetry-val text-emerald" id="telemetryScoreVal">--</span>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    // Allow DOM to settle before drawing SVG paths
    setTimeout(() => {
      this.drawConnectingPaths();
    }, 150);

    window.addEventListener("resize", () => {
      this.drawConnectingPaths();
    });
  }

  bindEvents() {
    const playBtn = document.getElementById("flowPlayBtn");
    if (playBtn) {
      playBtn.addEventListener("click", () => {
        this.animatePipelineFlow(this.pipelineData, true);
      });
    }

    const speedButtons = this.container.querySelectorAll(".speed-btn");
    speedButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        speedButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.options.animationSpeed = parseFloat(btn.dataset.speed) || 1.0;
      });
    });

    // Node click to inspect
    this.container.querySelectorAll(".flow-node, .subagent-node").forEach(node => {
      node.addEventListener("click", () => {
        this.container.querySelectorAll(".flow-node, .subagent-node").forEach(n => n.classList.remove("node-focused"));
        node.classList.add("node-focused");
        this.updateTelemetryForNode(node);
      });
    });
  }

  /**
   * Recalculates and redraws bezier curve connecting arrows between nodes
   */
  drawConnectingPaths() {
    const svgLayer = document.getElementById("flowSvgLayer");
    const pathsGroup = document.getElementById("flowPathsGroup");
    if (!svgLayer || !pathsGroup) return;

    const container = document.getElementById("flowCanvasContainer");
    if (!container) return;
    const cRect = container.getBoundingClientRect();

    const getNodePoint = (elId, anchor = "right") => {
      const el = document.getElementById(elId);
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      const x = anchor === "right" ? (r.right - cRect.left) : (anchor === "left" ? (r.left - cRect.left) : (r.left + r.width / 2 - cRect.left));
      const y = r.top + r.height / 2 - cRect.top;
      return { x, y };
    };

    const connections = [
      { from: "node-ingestion", to: "node-math", grad: "cyanIndigoGrad", id: "path-1-2" },
      { from: "node-math", to: "node-orchestrator", grad: "indigoAmberGrad", id: "path-2-3" },
      { from: "node-orchestrator", to: "node-subagent-persona", grad: "indigoAmberGrad", id: "path-3-persona" },
      { from: "node-orchestrator", to: "node-subagent-image", grad: "indigoAmberGrad", id: "path-3-image" },
      { from: "node-orchestrator", to: "node-subagent-video", grad: "indigoAmberGrad", id: "path-3-video" },
      { from: "node-orchestrator", to: "node-feedback", grad: "amberEmeraldGrad", id: "path-3-4" },
      { from: "node-feedback", to: "node-output", grad: "emeraldOutputGrad", id: "path-4-5" }
    ];

    let pathsHtml = "";

    for (const conn of connections) {
      const p1 = getNodePoint(conn.from, "right");
      const p2 = getNodePoint(conn.to, "left");

      const dx = Math.max(30, (p2.x - p1.x) * 0.5);
      const d = `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;

      pathsHtml += `
        <!-- Background Track Line -->
        <path d="${d}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2.5" stroke-linecap="round" />
        
        <!-- Live Animated Flow Beam -->
        <path id="${conn.id}" class="animated-flow-beam" d="${d}" fill="none" 
              stroke="url(#${conn.grad})" stroke-width="3" stroke-linecap="round" 
              filter="url(#neonFlowCyan)" stroke-dasharray="8 6" />

        <!-- Floating Data Particle -->
        <circle class="flow-particle" r="4" fill="#fff" filter="url(#neonFlowCyan)">
          <animateMotion dur="2.2s" repeatCount="indefinite" path="${d}" />
        </circle>
      `;
    }

    pathsGroup.innerHTML = pathsHtml;
  }

  /**
   * Set flow to resting/muted state
   */
  setMuted() {
    const canvas = document.getElementById("flowCanvasContainer");
    if (canvas) {
      canvas.classList.remove("flow-activated");
      canvas.classList.add("muted-flow");
    }
    const statusLabel = document.getElementById("flowStatusLabel");
    if (statusLabel) statusLabel.textContent = "Flow Resting • Ready to Activate";
    const dot = document.getElementById("flowRadarDot");
    if (dot) dot.className = "flow-radar-dot muted-dot";

    const telemetryStage = document.getElementById("telemetryStageVal");
    const telemetryData = document.getElementById("telemetryDataVal");
    if (telemetryStage) telemetryStage.textContent = "Resting Display Mode";
    if (telemetryData) telemetryData.textContent = "Click 'Create Ads' to activate live flow";

    if (this.container) {
      this.container.querySelectorAll(".flow-node, .subagent-node").forEach(n => {
        n.classList.remove("active-processing", "active-success", "node-focused");
      });
    }
  }

  /**
   * The MOMENT user clicks 'Create Ads with Ollama', immediately wake up the flow
   * and light up Stage 1 (Ingestion) with traveling beams and active radar!
   */
  triggerImmediateActivation(userProfile, slot, network, themeMode) {
    const canvas = document.getElementById("flowCanvasContainer");
    if (canvas) {
      canvas.classList.remove("muted-flow");
      canvas.classList.add("flow-activated");
    }

    const dot = document.getElementById("flowRadarDot");
    if (dot) dot.className = "flow-radar-dot active-dot";

    const statusLabel = document.getElementById("flowStatusLabel");
    if (statusLabel) statusLabel.textContent = "⚡ Trigger Received! [1/5] Ingesting OpenRTB 2.5 Signals into Blackboard...";

    const telemetryStage = document.getElementById("telemetryStageVal");
    const telemetryData = document.getElementById("telemetryDataVal");
    if (telemetryStage) telemetryStage.textContent = "1. Ingestion Active";
    if (telemetryData) telemetryData.textContent = `User: ${userProfile?.name || 'Profile'} • Format: ${slot?.width}x${slot?.height}`;

    if (this.container) {
      this.container.querySelectorAll(".flow-node, .subagent-node").forEach(n => {
        n.classList.remove("active-processing", "active-success", "node-focused");
      });
      const nodeIngestion = document.getElementById("node-ingestion");
      if (nodeIngestion) nodeIngestion.classList.add("active-processing");
    }
  }

  /**
   * Advance the visual flow step-by-step in real-time as each agent executes
   */
  advanceToStage(stage, data = {}) {
    const statusLabel = document.getElementById("flowStatusLabel");
    const telemetryStage = document.getElementById("telemetryStageVal");
    const telemetryData = document.getElementById("telemetryDataVal");
    const telemetryScore = document.getElementById("telemetryScoreVal");

    const clearActive = () => {
      if (!this.container) return;
      this.container.querySelectorAll(".flow-node, .subagent-node").forEach(n => {
        n.classList.remove("active-processing");
      });
    };

    if (stage === "ingestion") {
      const nodeIngestion = document.getElementById("node-ingestion");
      if (nodeIngestion) nodeIngestion.classList.add("active-processing");
      if (statusLabel) statusLabel.textContent = "⚡ [1/5] Ingesting Signals & Constraints into Blackboard...";
      if (telemetryStage) telemetryStage.textContent = "1. Ingestion Active";
      if (telemetryData) telemetryData.textContent = data.message || "OpenRTB stream connected";
    } else if (stage === "math") {
      const nodeIngestion = document.getElementById("node-ingestion");
      if (nodeIngestion) {
        nodeIngestion.classList.remove("active-processing");
        nodeIngestion.classList.add("active-success");
      }
      clearActive();
      const nodeMath = document.getElementById("node-math");
      if (nodeMath) nodeMath.classList.add("active-processing");

      if (statusLabel) statusLabel.textContent = "🧮 [2/5] Mathematical Agent computing deterministic weights...";
      if (telemetryStage) telemetryStage.textContent = "2. Math Engine Active";
      const topW = data.topSignals?.[0];
      if (telemetryData) telemetryData.textContent = topW ? `Top Weight: ${topW.signal} (${topW.weight.toFixed(2)})` : "Feature matrix scored";
    } else if (stage === "creative_start") {
      const nodeMath = document.getElementById("node-math");
      if (nodeMath) {
        nodeMath.classList.remove("active-processing");
        nodeMath.classList.add("active-success");
      }
      clearActive();
      const nodeOrch = document.getElementById("node-orchestrator");
      if (nodeOrch) nodeOrch.classList.add("active-processing");

      const subPersona = document.getElementById("node-subagent-persona");
      const subImage = document.getElementById("node-subagent-image");
      const subVideo = document.getElementById("node-subagent-video");
      if (subPersona) subPersona.classList.add("active-processing");
      if (subImage) subImage.classList.add("active-processing");
      if (subVideo) subVideo.classList.add("active-processing");

      if (statusLabel) statusLabel.textContent = "✨ [3/5] Creativation Engine: Calling Ollama (llama3.2:1b) for Persona copy...";
      if (telemetryStage) telemetryStage.textContent = "3. Creativation Engine Active";
      if (telemetryData) telemetryData.textContent = "Ollama model generating distinct archetypes...";
    } else if (stage === "creative_done") {
      const subPersona = document.getElementById("node-subagent-persona");
      const subImage = document.getElementById("node-subagent-image");
      const subVideo = document.getElementById("node-subagent-video");
      if (subPersona) { subPersona.classList.remove("active-processing"); subPersona.classList.add("active-success"); }
      if (subImage) { subImage.classList.remove("active-processing"); subImage.classList.add("active-success"); }
      if (subVideo) { subVideo.classList.remove("active-processing"); subVideo.classList.add("active-success"); }

      if (statusLabel) statusLabel.textContent = "✨ Creativation Hub: Copy & visuals synthesized. Handing to Feedback Gate...";
      if (telemetryData) telemetryData.textContent = data.message || "Proposals synthesized";
    } else if (stage === "feedback") {
      const nodeOrch = document.getElementById("node-orchestrator");
      if (nodeOrch) { nodeOrch.classList.remove("active-processing"); nodeOrch.classList.add("active-success"); }
      clearActive();
      const nodeFeedback = document.getElementById("node-feedback");
      if (nodeFeedback) nodeFeedback.classList.add("active-processing");

      const score = data.score || 92;
      const gaugeFill = document.getElementById("flowGaugeFill");
      const gaugeLabel = document.getElementById("flowGaugeLabel");
      if (gaugeFill) gaugeFill.style.width = `${score}%`;
      if (gaugeLabel) gaugeLabel.textContent = `${score} / 100 PTS`;
      if (telemetryScore) telemetryScore.textContent = `${score} / 100 (Threshold ${data.threshold || 85})`;

      if (statusLabel) statusLabel.textContent = `🛡️ [4/5] Feedback Agent: Auditing variants (${score}/100 PTS)...`;
      if (telemetryStage) telemetryStage.textContent = "4. Feedback Gatekeeper Active";
      if (telemetryData) telemetryData.textContent = data.message || "100-point rubric audit complete";
    } else if (stage === "complete") {
      const nodeFeedback = document.getElementById("node-feedback");
      if (nodeFeedback) { nodeFeedback.classList.remove("active-processing"); nodeFeedback.classList.add("active-success"); }
      clearActive();
      const nodeOutput = document.getElementById("node-output");
      if (nodeOutput) {
        nodeOutput.classList.add("active-processing");
        setTimeout(() => nodeOutput.classList.add("active-success"), 400);
      }

      if (statusLabel) statusLabel.textContent = "✅ [5/5] Pipeline Certified! Two Ad Variants Delivered.";
      if (telemetryStage) telemetryStage.textContent = "5. Delivered & Certified";
      if (telemetryData) telemetryData.textContent = `Completed in ${data.elapsedSec || '5'}s • Ready for Display`;
    }
  }

  /**
   * Run the choreographed visual animation reflecting the active pipeline state
   * Turns on vibrant activated colors!
   */
  async animatePipelineFlow(pipelineData, forceReplay = false) {
    if (!pipelineData) return;
    this.pipelineData = pipelineData;
    this.isPlaying = true;

    // Wake up canvas: Remove muted, Add ACTIVATED
    const canvas = document.getElementById("flowCanvasContainer");
    if (canvas) {
      canvas.classList.remove("muted-flow");
      canvas.classList.add("flow-activated");
    }

    const baseDelay = 600 / (this.options.animationSpeed || 1.0);
    const statusLabel = document.getElementById("flowStatusLabel");
    const dot = document.getElementById("flowRadarDot");
    const telemetryStage = document.getElementById("telemetryStageVal");
    const telemetryData = document.getElementById("telemetryDataVal");
    const telemetryScore = document.getElementById("telemetryScoreVal");

    if (dot) dot.className = "flow-radar-dot active-dot";

    const clearActive = () => {
      this.container.querySelectorAll(".flow-node, .subagent-node").forEach(n => {
        n.classList.remove("active-processing", "active-success");
      });
    };

    // 1. Ingestion Stage
    clearActive();
    const nodeIngestion = document.getElementById("node-ingestion");
    if (nodeIngestion) nodeIngestion.classList.add("active-processing");
    if (statusLabel) statusLabel.textContent = "⚡ Ingesting Signals & Constraints into Blackboard...";
    if (telemetryStage) telemetryStage.textContent = "1. Ingestion Active";
    if (telemetryData) telemetryData.textContent = `User: ${pipelineData.state?.inputs?.user_profile?.name || 'Profile'}`;
    await this.sleep(baseDelay);

    // 2. Mathematical Optimization
    clearActive();
    if (nodeIngestion) nodeIngestion.classList.add("active-success");
    const nodeMath = document.getElementById("node-math");
    if (nodeMath) nodeMath.classList.add("active-processing");
    if (statusLabel) statusLabel.textContent = "🧮 Mathematical Agent Computing Deterministic Weights...";
    if (telemetryStage) telemetryStage.textContent = "2. Math Engine Active";
    const topW = pipelineData.state?.mathematical_evaluation?.top_weighted_signals?.[0];
    if (telemetryData) telemetryData.textContent = `Top Weight: ${topW?.signal?.split(" ")[0]} (${topW?.weight?.toFixed(2)})`;
    await this.sleep(baseDelay * 1.2);

    // 3. Creative Orchestration & Subagents
    clearActive();
    if (nodeMath) nodeMath.classList.add("active-success");
    const nodeOrch = document.getElementById("node-orchestrator");
    if (nodeOrch) nodeOrch.classList.add("active-processing");
    if (statusLabel) statusLabel.textContent = "✨ Creativation Hub: Persona, Image & Video Subagents collaborating...";
    if (telemetryStage) telemetryStage.textContent = "3. Creativation Engine Active";
    if (telemetryData) telemetryData.textContent = "Calling Ollama llama3.2:1b for Personas";
    
    // Animate the 3 subagents
    const subPersona = document.getElementById("node-subagent-persona");
    const subImage = document.getElementById("node-subagent-image");
    const subVideo = document.getElementById("node-subagent-video");
    if (subPersona) subPersona.classList.add("active-processing");
    if (subImage) subImage.classList.add("active-processing");
    if (subVideo) subVideo.classList.add("active-processing");
    await this.sleep(baseDelay * 1.5);

    // 4. Feedback Agent Audit
    clearActive();
    if (nodeOrch) nodeOrch.classList.add("active-success");
    if (subPersona) subPersona.classList.add("active-success");
    if (subImage) subImage.classList.add("active-success");
    if (subVideo) subVideo.classList.add("active-success");
    const nodeFeedback = document.getElementById("node-feedback");
    if (nodeFeedback) nodeFeedback.classList.add("active-processing");
    if (statusLabel) statusLabel.textContent = "🛡️ Feedback Agent Auditing Variants against 100-Point Rubric...";
    if (telemetryStage) telemetryStage.textContent = "4. Feedback Gatekeeper Active";
    
    const feedback = pipelineData.state?.feedback_audit;
    const score = feedback?.composite_score || 92;
    const gaugeFill = document.getElementById("flowGaugeFill");
    const gaugeLabel = document.getElementById("flowGaugeLabel");
    if (gaugeFill) gaugeFill.style.width = `${score}%`;
    if (gaugeLabel) gaugeLabel.textContent = `${score} / 100 PTS`;
    if (telemetryScore) telemetryScore.textContent = `${score} / 100 (Threshold ${feedback?.score_threshold || 85})`;
    await this.sleep(baseDelay);

    // 5. Output Ready
    clearActive();
    if (nodeFeedback) nodeFeedback.classList.add("active-success");
    const nodeOutput = document.getElementById("node-output");
    if (nodeOutput) {
      nodeOutput.classList.add("active-processing");
      setTimeout(() => nodeOutput.classList.add("active-success"), 300);
    }
    if (statusLabel) statusLabel.textContent = "✅ Flow Activated: Two Distinct Ad Variants Generated via Ollama!";
    if (telemetryStage) telemetryStage.textContent = "5. Completed & Certified";
    if (telemetryData) telemetryData.textContent = "Variant A & Variant B Ready";
    this.isPlaying = false;
  }

  updateTelemetryForNode(node) {
    const stage = node.dataset.stage;
    const telemetryStage = document.getElementById("telemetryStageVal");
    const telemetryData = document.getElementById("telemetryDataVal");

    if (telemetryStage) telemetryStage.textContent = node.querySelector(".node-title")?.textContent || stage;
    if (telemetryData) telemetryData.textContent = node.querySelector(".node-meta")?.textContent || "Active Blackboard Slice";
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
