/**
 * Ad Variant Visual Renderer
 * Dynamically builds responsive, pixel-accurate ad units matching strict slot dimensions.
 * Includes interactive device simulation modal for user-friendly testing.
 */

export class AdRenderer {
  /**
   * Render an ad variant inside a target container
   */
  static renderVariantCard(containerId, variant, slot, network, isVariantA = true) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!variant) {
      container.innerHTML = `
        <div class="ad-empty-state">
          <p>Awaiting Creative Orchestrator execution...</p>
        </div>
      `;
      return;
    }

    const tagClass = isVariantA ? "tag-a" : "tag-b";
    const variantTagLabel = `${isVariantA ? '⚡' : '✦'} ${variant.persona.archetype}`;
    const themePill = variant.persona.theme_category ? `<span class="variant-theme-pill">${variant.persona.theme_category}</span>` : '';
    const isBanner = slot.width === 320 && slot.height === 50;
    const isPortrait = slot.height > 500;

    // Build the internal HTML structure for the ad unit
    const frameWidth = slot.width;
    const frameHeight = slot.height;

    // Video indicator badge
    let mediaBadge = `<span class="ad-sponsor-pill">STATIC • ${variant.visual.width}x${variant.visual.height}</span>`;
    if (variant.video && variant.video.enabled) {
      mediaBadge = `<span class="ad-sponsor-pill video-pill">🎬 15s VIDEO • 1080p</span>`;
    } else if (network.connection_type === "3G" || network.data_saver_active) {
      mediaBadge = `<span class="ad-sponsor-pill" style="color: #f59e0b;">📶 3G BUFFER OPTIMIZED</span>`;
    }

    // Storyboard snippet if video is enabled
    let videoStoryboardHtml = "";
    if (variant.video && variant.video.enabled && variant.video.storyboard) {
      const sb = variant.video.storyboard;
      videoStoryboardHtml = `
        <div class="video-storyboard-box">
          <div class="storyboard-header">🎬 Motion Storyboard (${sb.pacing}):</div>
          <div class="storyboard-hook"><strong>0-3s Hook:</strong> ${sb.scenes[0].description}</div>
          <div class="storyboard-audio"><strong>Audio:</strong> ${sb.audio_direction}</div>
        </div>
      `;
    }

    // Signal attribution badges
    const signalTagsHtml = (variant.signal_attribution || []).map(attr => `
      <span class="attr-tag" title="Signal Weight: ${attr.weight}">
        <strong>${attr.signal.split(" ")[0]}:</strong> ${attr.value} <em>(w:${attr.weight})</em>
      </span>
    `).join("");

    container.innerHTML = `
      <div class="variant-meta-header">
        <div class="variant-title-wrap">
          <span class="variant-title-tag ${tagClass}">${variantTagLabel}</span>
          ${themePill}
        </div>
        <button class="btn btn-sm btn-outline open-device-modal-btn" 
                data-variant-id="${variant.variant_id}" 
                title="Preview inside smartphone simulator">
          📱 Device Simulator
        </button>
      </div>
      <div class="variant-tone-line">
        <span class="tone-icon">🎭</span>
        <span class="tone-text">Tone: <em>${variant.persona.tone}</em> (${variant.persona.trigger})</span>
      </div>

      <!-- Real Dimension Preview Stage -->
      <div class="ad-preview-stage" id="stage-${variant.variant_id}">
        <div class="ad-mockup-frame ${isBanner ? 'banner-layout' : ''}" 
             style="width: ${frameWidth}px; height: ${frameHeight}px; background-image: url('${variant.visual.asset_url}');">
          
          <!-- Contrast Gradient Layer -->
          <div class="ad-gradient-overlay" style="background: ${variant.visual.background};"></div>

          <!-- Ad Content -->
          <div class="ad-content-layer">
            <!-- Top Row -->
            <div class="ad-top-row">
              <span class="ad-badge" style="${variant.visual.badge_style}">
                ${variant.visual.badge_text}
              </span>
              ${mediaBadge}
            </div>

            <!-- Middle Copy -->
            <div class="ad-middle-copy">
              <h4 class="ad-headline" style="font-size: ${isBanner ? '0.78rem' : (isPortrait ? '1.25rem' : '1.0rem')}">
                ${variant.copy.headline}
              </h4>
              ${variant.copy.body ? `
                <p class="ad-body" style="font-size: ${isPortrait ? '0.85rem' : '0.74rem'}">
                  ${variant.copy.body}
                </p>
              ` : ''}
            </div>

            <!-- Bottom CTA Button -->
            <button class="ad-cta-button" 
                    id="cta-${variant.variant_id}" 
                    style="${variant.visual.cta_style}">
              ${variant.copy.cta}
            </button>
          </div>
        </div>
      </div>

      ${videoStoryboardHtml}

      <!-- Signal Attribution Drawer -->
      <div class="attribution-box">
        <div class="attribution-title">Top Weighted Drivers (Mathematical Attribution)</div>
        <div class="attribution-tags">
          ${signalTagsHtml}
        </div>
      </div>
    `;

    // Attach click events to CTA
    const ctaBtn = container.querySelector(`#cta-${variant.variant_id}`);
    if (ctaBtn) {
      ctaBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        AdRenderer.showClickFeedback(ctaBtn, variant);
      });
    }

    // Attach click event to Device Simulator button
    const devBtn = container.querySelector(".open-device-modal-btn");
    if (devBtn) {
      devBtn.addEventListener("click", () => {
        AdRenderer.openDeviceModal(variant, slot, network);
      });
    }
  }

  /**
   * Show engaging micro-interaction when clicking the ad
   */
  static showClickFeedback(button, variant) {
    const originalText = button.textContent;
    button.textContent = "✓ Conversion Recorded!";
    button.style.transform = "scale(0.96)";
    
    // Create floating click particle
    const ripple = document.createElement("div");
    ripple.className = "click-ripple-bubble";
    ripple.textContent = "+1 CTR Event";
    button.parentElement.appendChild(ripple);

    setTimeout(() => {
      button.textContent = originalText;
      button.style.transform = "none";
      ripple.remove();
    }, 1800);
  }

  /**
   * Open the Smartphone Device Simulator Modal
   */
  static openDeviceModal(variant, slot, network) {
    const modal = document.getElementById("deviceSimulatorModal");
    if (!modal) return;

    const modalBody = document.getElementById("simulatorModalContent");
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="phone-frame">
        <!-- Phone Notch / Dynamic Island -->
        <div class="phone-notch">
          <div class="camera-lens"></div>
          <div class="speaker-pill"></div>
        </div>

        <!-- Phone Screen Content -->
        <div class="phone-screen">
          <!-- Status Bar -->
          <div class="phone-status-bar">
            <span>9:41</span>
            <div class="phone-status-icons">
              <span>📶 ${network.connection_type}</span>
              <span>🔋 98%</span>
            </div>
          </div>

          <!-- Simulated Host App Background UI -->
          <div class="host-app-mockup">
            <div class="host-app-header">
              <span class="host-app-pill">Host Application Feed</span>
              <span class="host-app-close">✕</span>
            </div>
            
            <div class="host-app-content-stream">
              <div class="host-post-placeholder"></div>
              
              <!-- In-App Ad Container -->
              <div class="in-app-ad-wrapper">
                <div class="in-app-ad-badge">SPONSORED ADVERTISEMENT</div>
                <div class="ad-mockup-frame" 
                     style="width: 100%; max-width: ${slot.width}px; height: ${slot.height}px; background-image: url('${variant.visual.asset_url}'); margin: 0 auto;">
                  <div class="ad-gradient-overlay" style="background: ${variant.visual.background};"></div>
                  <div class="ad-content-layer">
                    <div class="ad-top-row">
                      <span class="ad-badge" style="${variant.visual.badge_style}">${variant.visual.badge_text}</span>
                      <span class="ad-sponsor-pill">PROMOTED</span>
                    </div>
                    <div class="ad-middle-copy">
                      <h4 class="ad-headline">${variant.copy.headline}</h4>
                      ${variant.copy.body ? `<p class="ad-body">${variant.copy.body}</p>` : ''}
                    </div>
                    <button class="ad-cta-button" style="${variant.visual.cta_style}" onclick="alert('Device Conversion Simulated! CTR Recorded for ${variant.name}')">
                      ${variant.copy.cta}
                    </button>
                  </div>
                </div>
              </div>

              <div class="host-post-placeholder"></div>
              <div class="host-post-placeholder"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Details & Actions -->
      <div class="simulator-sidebar">
        <div class="sidebar-header">
          <h3>${variant.name}</h3>
          <span class="sidebar-tag">${variant.persona.archetype}</span>
        </div>

        <div class="simulator-meta-card">
          <div class="sim-meta-row">
            <span class="sim-label">Display Slot:</span>
            <span class="sim-val">${slot.name} (${slot.width}x${slot.height})</span>
          </div>
          <div class="sim-meta-row">
            <span class="sim-label">Target Network:</span>
            <span class="sim-val">${network.name}</span>
          </div>
          <div class="sim-meta-row">
            <span class="sim-label">Tone & Hook:</span>
            <span class="sim-val text-amber">${variant.persona.tone}</span>
          </div>
        </div>

        <div class="simulator-copy-inspector">
          <h4>Generated Ad Copy & Character Compliance</h4>
          <div class="copy-field">
            <label>Headline (${variant.copy.char_counts.headline} chars):</label>
            <div class="copy-box">${variant.copy.headline}</div>
          </div>
          ${variant.copy.body ? `
            <div class="copy-field">
              <label>Body Copy (${variant.copy.char_counts.body} chars):</label>
              <div class="copy-box">${variant.copy.body}</div>
            </div>
          ` : ''}
          <div class="copy-field">
            <label>Call to Action (${variant.copy.char_counts.cta} chars):</label>
            <div class="copy-box">${variant.copy.cta}</div>
          </div>
        </div>

        <div class="simulator-actions">
          <button class="btn btn-primary" onclick="alert('Ad Variant Exported for DSP Campaign Deployment!')">
            🚀 Export for RTB Bid Stream
          </button>
        </div>
      </div>
    `;

    modal.classList.add("active");
  }
}
