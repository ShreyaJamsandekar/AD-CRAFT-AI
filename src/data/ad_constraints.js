/**
 * Ad Delivery and Environmental Constraints
 * Defines strict physical, network, and regulatory constraints for ad rendering.
 */

export const AD_SLOT_FORMATS = [
  {
    id: "mrec_300x250",
    name: "300 x 250 Medium Rectangle (MREC)",
    width: 300,
    height: 250,
    aspect_ratio: "6:5",
    description: "Standard in-feed or post-level rectangular ad unit",
    max_headline_chars: 42,
    max_body_chars: 80,
    max_cta_chars: 16,
    supports_video: true,
    default_payload_limit_kb: 800
  },
  {
    id: "banner_320x50",
    name: "320 x 50 Mobile Leaderboard Banner",
    width: 320,
    height: 50,
    aspect_ratio: "32:5",
    description: "Persistent bottom or top screen anchor banner",
    max_headline_chars: 24,
    max_body_chars: 0, // No room for body
    max_cta_chars: 12,
    supports_video: false, // Banners are static / micro-GIF only
    default_payload_limit_kb: 150
  },
  {
    id: "interstitial_360x640",
    name: "360 x 640 Vertical Full-Screen Interstitial",
    width: 360,
    height: 640,
    aspect_ratio: "9:16",
    description: "Immersive full-screen portrait ad between game levels or content breaks",
    max_headline_chars: 60,
    max_body_chars: 140,
    max_cta_chars: 20,
    supports_video: true,
    default_payload_limit_kb: 2500
  },
  {
    id: "native_card_340x280",
    name: "340 x 280 Responsive Native Card",
    width: 340,
    height: 280,
    aspect_ratio: "17:14",
    description: "Blends seamlessly into social feeds or news streams",
    max_headline_chars: 50,
    max_body_chars: 95,
    max_cta_chars: 18,
    supports_video: true,
    default_payload_limit_kb: 950
  }
];

export const NETWORK_PROFILES = [
  {
    id: "net_5g_ultra",
    name: "5G / High-Speed Fiber",
    connection_type: "5G",
    downlink_mbps: 45.0,
    rtt_ms: 18,
    buffer_latency: "Ultra-Low (<20ms)",
    data_saver_active: false,
    allows_video: true,
    max_payload_kb: 3000
  },
  {
    id: "net_4g_lte",
    name: "4G LTE Standard Mobile",
    connection_type: "4G",
    downlink_mbps: 9.5,
    rtt_ms: 65,
    buffer_latency: "Normal (~60ms)",
    data_saver_active: false,
    allows_video: true,
    max_payload_kb: 1200
  },
  {
    id: "net_3g_constrained",
    name: "3G / Slow Buffer / Data Saver Mode",
    connection_type: "3G",
    downlink_mbps: 0.75, // Critical low bandwidth
    rtt_ms: 480, // High latency
    buffer_latency: "High (>450ms) - Drop-off Risk",
    data_saver_active: true,
    allows_video: false, // HARD PROHIBITION: Video streaming blocked to avoid user drop-off
    max_payload_kb: 180
  }
];

export const DEFAULT_PIPELINE_CONFIG = {
  score_threshold: 85.0, // Minimum feedback score required for approval
  max_feedback_iterations: 3,
  strict_compliance: true
};
