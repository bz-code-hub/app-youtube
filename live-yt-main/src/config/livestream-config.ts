/**
 * LIVESTREAM CONFIGURATION
 * Edit this file to customize your live broadcast settings
 */

// ═══════════════════════════════════════════════════════════════
// VIDEO CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const videoConfig = {
  videoType: "youtube" as "youtube" | "vimeo" | "panda" | "vturb" | "direct",
  videoId: "https://www.youtube.com/shorts/VsWdwMfr6A0",
  vimeoEmbedCode: '',
  pandaEmbedCode: '',
  vturbScript: '',
  directVideoUrl: "",

  viewers: {
    dropEnabled: false,
    initialCount: 5000,
    beforeDrop: { min: 5000, max: 7000 },
    afterDrop: { min: 350, max: 400 },
    dropTimeInSeconds: 10,
    updateInterval: 3000,
  },
};

// ═══════════════════════════════════════════════════════════════
// THEME CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const themeConfig = {
  darkMode: true,
};

// ═══════════════════════════════════════════════════════════════
// CHANNEL CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const channelConfig = {
  profileImageUrl: "youtube",
};

// ═══════════════════════════════════════════════════════════════
// CTA BUTTON CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const ctaButtonConfig = {
  enabled: true,
  text: "Watch Now!",
  delayInSeconds: 10,
  link: "https://example.com",
  
  color: {
    red: true,
    blue: false,
    gray: false,
    black: false,
    white: false,
  },

  effects: {
    pulse: false,
    glow: false,
    shake: false,
    bounce: true,
    float: false,
  },

  icon: {
    click: true,
    gift: false,
    tag: false,
    trending: false,
    sparkles: false,
  },
};

// ═══════════════════════════════════════════════════════════════
// CHAT CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const chatConfig = {
  title: "Live chat",
  topMessagesLabel: "Top messages",
  inputPlaceholder: "Chat...",
  commentInterval: 1,
  loopComments: true,
};

// ═══════════════════════════════════════════════════════════════
// TRACKING PIXELS CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const pixelsConfig = {
  facebookPixel: ``,
  tiktokPixel: ``,
  googleAnalyticsPixel: ``,
};

// ═══════════════════════════════════════════════════════════════
// CHAT COMMENTS
// ═══════════════════════════════════════════════════════════════

export const comments = [
  { user: "Marcus Johnson", message: "What an incredible match! Both teams are playing amazing!" },
  { user: "Sarah Thompson", message: "Best performance I've seen all season!" },
  { user: "David Chen", message: "The defending is outstanding right now" },
  { user: "Emma Wilson", message: "This is why I love soccer! Pure excitement" },
  { user: "James Rodriguez", message: "Absolutely thrilling live coverage! 🔥" },
  { user: "Lisa Anderson", message: "The chemistry between these players is off the charts" },
  { user: "Michael Brown", message: "Best game of the tournament so far" },
  { user: "Jessica Miller", message: "I can't take my eyes off this performance!" },
  { user: "Carlos Santos", message: "The speed and precision is incredible" },
  { user: "Rachel White", message: "What amazing footwork! Professional level play" },
  { user: "Brandon Lee", message: "This is why soccer is the world's game" },
  { user: "Nicole Davis", message: "The goalkeeper is absolutely stellar today" },
  { user: "Kevin Taylor", message: "Every play is intense and competitive" },
  { user: "Amy Martinez", message: "Love watching teams like this compete at the highest level" },
  { user: "Christopher Moore", message: "The momentum keeps shifting - unpredictable!" },
  { user: "Michelle Jackson", message: "Phenomenal display of athleticism and skill" },
  { user: "Daniel Clark", message: "This is the kind of match that reminds you why you love sports" },
  { user: "Lauren Garcia", message: "The defense is holding strong - very tactical" },
  { user: "Ryan Anderson", message: "What a performance! Both teams deserve standing ovation" },
  { user: "Stephanie Powell", message: "The energy in this broadcast is contagious!" },
  { user: "Justin Harris", message: "Absolutely captivating football - can't look away" },
  { user: "Heather Martin", message: "The play quality is outstanding right now" },
  { user: "Tyler Robinson", message: "This is broadcast quality coverage! Excellent camera work" },
  { user: "Brittany Clark", message: "The commentary is really insightful and engaging" },
  { user: "Aaron Young", message: "Professional athletes at their finest!" },
  { user: "Victoria Scott", message: "The pace of play is incredible - non-stop action" },
];
