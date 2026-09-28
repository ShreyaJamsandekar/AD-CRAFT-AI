/**
 * Synthetic User Profile Datasets
 * Based on AppLovin MAX, OpenRTB 2.5, and mobile DSP behavioral bidding signals.
 */

export const SYNTHETIC_USER_PRESETS = [
  {
    id: "user_gamer_pro",
    name: "Alex Chen - Competitive RPG Gamer",
    avatar: "🎮",
    headline: "High-LTV Gamer, 5G Fast Network, Evening Session",
    demographics: {
      age: 24,
      gender: "Male",
      language: "en-US",
      location: {
        country: "USA",
        region: "CA",
        city: "San Francisco",
        metro_tier: "Tier 1 Metro",
        timezone: "America/Los_Angeles"
      }
    },
    app_context: {
      current_app_name: "Shadow Blades: Arena",
      bundle_id: "com.lumina.shadowblades",
      iab_category: "IAB9-30 (Video Games / Action RPG)",
      session_duration_mins: 38,
      daypart: "Evening Peak (21:15)",
      is_rewarded_context: true
    },
    behavioral_signals: {
      primary_affinity: "Action / RPG Mobile Games",
      secondary_affinity: "Mechanical Keyboards & Gaming Gear",
      historical_ctr: 0.052, // 5.2% high engagement
      historical_cvr: 0.016,
      predicted_ltv_tier: "High ($80 - $250 / yr)",
      iap_recency_days: 2, // Active spender
      ad_fatigue_score: 0.18, // Fresh session
      rewarded_video_propensity: 0.94
    },
    device: {
      device_type: "Smartphone",
      make: "Apple",
      model: "iPhone 15 Pro",
      os: "iOS 17.5",
      screen_dpr: 3.0,
      hardware_tier: "Flagship"
    },
    compliance: {
      gdpr_consent: true,
      ccpa_opt_out: false,
      coppa_flag: 0 // Non-child
    }
  },
  {
    id: "user_ecommerce_saver",
    name: "Priya Sharma - Smart D2C Deal Seeker",
    avatar: "🛍️",
    headline: "Price-Sensitive Shopper, 3G Slow Buffer, Commute Hours",
    demographics: {
      age: 29,
      gender: "Female",
      language: "en-US",
      location: {
        country: "USA",
        region: "IL",
        city: "Chicago",
        metro_tier: "Tier 2 Metro",
        timezone: "America/Chicago"
      }
    },
    app_context: {
      current_app_name: "Metro Transit Guide",
      bundle_id: "com.transit.chicago",
      iab_category: "IAB19-33 (Travel / Commuter Transit)",
      session_duration_mins: 8,
      daypart: "Rush Hour Commute (17:40)",
      is_rewarded_context: false
    },
    behavioral_signals: {
      primary_affinity: "Apparel, Athleisure & Flash Sales",
      secondary_affinity: "Coffee Subscriptions & Urban Gear",
      historical_ctr: 0.038,
      historical_cvr: 0.024,
      predicted_ltv_tier: "Mid ($30 - $75 / yr)",
      iap_recency_days: 14,
      ad_fatigue_score: 0.52,
      discount_coupon_sensitivity: 0.89
    },
    device: {
      device_type: "Smartphone",
      make: "Samsung",
      model: "Galaxy A54 5G",
      os: "Android 14",
      screen_dpr: 2.0,
      hardware_tier: "Mid-Range"
    },
    compliance: {
      gdpr_consent: true,
      ccpa_opt_out: false,
      coppa_flag: 0
    }
  },
  {
    id: "user_fintech_executive",
    name: "Marcus Vance - Wealth & Portfolio Optimizer",
    avatar: "📈",
    headline: "Ultra-High LTV, High Intent, Morning Productivity",
    demographics: {
      age: 38,
      gender: "Male",
      language: "en-US",
      location: {
        country: "USA",
        region: "NY",
        city: "New York",
        metro_tier: "Tier 1 Metro",
        timezone: "America/New_York"
      }
    },
    app_context: {
      current_app_name: "MarketPulse Terminal",
      bundle_id: "com.pulse.financial",
      iab_category: "IAB14-1 (Personal Finance / Investing)",
      session_duration_mins: 22,
      daypart: "Morning Market Open (08:30)",
      is_rewarded_context: false
    },
    behavioral_signals: {
      primary_affinity: "FinTech, Automated Investing & ETFs",
      secondary_affinity: "Luxury Travel & Premium Credit",
      historical_ctr: 0.021, // Selective clicker
      historical_cvr: 0.045, // High conversion when clicking
      predicted_ltv_tier: "Ultra-High ($300+ / yr)",
      iap_recency_days: 5,
      ad_fatigue_score: 0.31,
      premium_brand_affinity: 0.92
    },
    device: {
      device_type: "Smartphone",
      make: "Samsung",
      model: "Galaxy S24 Ultra",
      os: "Android 14",
      screen_dpr: 3.0,
      hardware_tier: "Flagship"
    },
    compliance: {
      gdpr_consent: true,
      ccpa_opt_out: false,
      coppa_flag: 0
    }
  },
  {
    id: "user_fitness_achiever",
    name: "Elena Rostova - HIIT & Wellness Enthusiast",
    avatar: "🏃‍♀️",
    headline: "Fitness Tracker User, 4G LTE, Weekend Afternoon",
    demographics: {
      age: 31,
      gender: "Female",
      language: "en-US",
      location: {
        country: "USA",
        region: "CO",
        city: "Denver",
        metro_tier: "Tier 1 Metro",
        timezone: "America/Denver"
      }
    },
    app_context: {
      current_app_name: "PaceKeeper Run Tracker",
      bundle_id: "com.pacekeeper.fitness",
      iab_category: "IAB10-5 (Health & Fitness / Running)",
      session_duration_mins: 45,
      daypart: "Weekend Post-Workout (11:00)",
      is_rewarded_context: true
    },
    behavioral_signals: {
      primary_affinity: "Smart Wearables, Nutrition & HIIT",
      secondary_affinity: "Hydration Electrolytes & Athletic Shoes",
      historical_ctr: 0.044,
      historical_cvr: 0.028,
      predicted_ltv_tier: "Mid-High ($90 - $180 / yr)",
      iap_recency_days: 8,
      ad_fatigue_score: 0.25,
      habit_tracking_motivation: 0.91
    },
    device: {
      device_type: "Tablet",
      make: "Apple",
      model: "iPad Pro 11-inch",
      os: "iPadOS 17.5",
      screen_dpr: 2.0,
      hardware_tier: "Flagship"
    },
    compliance: {
      gdpr_consent: true,
      ccpa_opt_out: false,
      coppa_flag: 0
    }
  }
];
