/**
 * Blackboard State Architecture
 * Shared multi-agent knowledge repository facilitating decoupled agent communication.
 */

export class Blackboard {
  constructor(initialData = {}) {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.iteration = 0;
    this.status = "INITIALIZED";
    this.createdAt = new Date().toISOString();

    // The shared memory slices
    this.state = {
      inputs: {
        user_profile: initialData.user_profile || null,
        ad_constraints: initialData.ad_constraints || null,
        score_threshold: initialData.score_threshold || 85.0
      },
      mathematical_evaluation: {
        prioritized_constraints: [],
        top_weighted_signals: [],
        format_budget: {}
      },
      subagent_contributions: {
        persona_spec: null,
        image_spec: null,
        video_spec: null
      },
      creative_proposals: {
        variant_a: null,
        variant_b: null
      },
      feedback_audit: null,
      final_approved_ads: null
    };

    // Event and audit history log
    this.history = [];
    this.listeners = [];

    this.log("Blackboard initialized with user profile & ad constraints", "system", {
      userId: this.state.inputs.user_profile?.id,
      slotFormat: this.state.inputs.ad_constraints?.slot?.name,
      network: this.state.inputs.ad_constraints?.network?.name
    });
  }

  /**
   * Update a specific slice of the Blackboard
   */
  updateSlice(sliceKey, data, authorAgentId) {
    if (!(sliceKey in this.state)) {
      this.state[sliceKey] = {};
    }

    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
      this.state[sliceKey] = { ...this.state[sliceKey], ...data };
    } else {
      this.state[sliceKey] = data;
    }

    this.log(`Updated blackboard slice [${sliceKey}]`, authorAgentId, {
      slice: sliceKey,
      preview: typeof data === "object" ? Object.keys(data) : data
    });

    this.notify({ type: "SLICE_UPDATED", sliceKey, authorAgentId, state: this.state });
  }

  /**
   * Log an event to the blackboard audit trail
   */
  log(message, agentId = "system", metadata = {}) {
    const entry = {
      id: `log_${this.history.length + 1}`,
      timestamp: new Date().toISOString(),
      agentId,
      message,
      metadata,
      iteration: this.iteration
    };
    this.history.push(entry);
    return entry;
  }

  /**
   * Increment refinement loop iteration
   */
  nextIteration() {
    this.iteration += 1;
    this.log(`Entered refinement iteration ${this.iteration}`, "blackboard_controller");
  }

  /**
   * Subscribe to blackboard changes
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(event) {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error("Blackboard listener error:", err);
      }
    }
  }

  /**
   * Export immutable snapshot for API / UI
   */
  snapshot() {
    return {
      sessionId: this.sessionId,
      iteration: this.iteration,
      status: this.status,
      createdAt: this.createdAt,
      state: JSON.parse(JSON.stringify(this.state)),
      history: [...this.history]
    };
  }
}
