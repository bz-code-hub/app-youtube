/**
 * ⚙️ LIVESTREAM CONFIGURATION
 *
 * This file centralizes ALL editable settings for your livestream.
 * Edit here to fully customize your live broadcast!
 */

// ═══════════════════════════════════════════════════════════════
// 📹 VIDEO CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const videoConfig = {
  // 🎬 VIDEO TYPE
  // Choose: "youtube", "vimeo", "panda", "vturb" or "direct"
  videoType: "youtube" as "youtube" | "vimeo" | "panda" | "vturb" | "direct",

  // 📹 YOUTUBE: Paste the complete video URL or just the video ID
  // Examples:
  //   Full URL: "https://www.youtube.com/watch?v=TkRmrPQDPFw"
  //   Short URL: "https://youtu.be/TkRmrPQDPFw"
  //   Shorts: "https://www.youtube.com/shorts/VsWdwMfr6A0"
  //   Just ID: "TkRmrPQDPFw"
  videoId: "https://www.youtube.com/shorts/VsWdwMfr6A0",

  // 🎬 VIMEO: Paste the complete embed code provided by Vimeo
  // Just replace the video ID (1138111783) with your own Vimeo video ID
  vimeoEmbedCode: '<div style="padding:177.78% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1138111783?badge=0&autopause=0&player_id=0&app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Vimeo video"></iframe></div><script src="https://player.vimeo.com/api/player.js"><\/script>',

  // 🐼 PANDA VIDEO: Paste the complete embed code provided by Panda Video
  // Example: <div style="position:relative;padding-top:75%;"><iframe id="panda-xxxxx"...></iframe></div>
  pandaEmbedCode: "",

  // 📺 VTURB: Paste the entire script provided by Vturb
  // Example: <div id="vid_xxxxxxxxx" style="..."></div><script...></script>
  vturbScript: "",

  // 🔗 DIRECT LINK: Paste a direct link to your video file
  // Example: https://s3.planilhinha.cloud/1_original.mp4
  // Supports: MP4, WebM, OGG
  directVideoUrl: "",

  // 📊 Live viewer configuration
  viewers: {
    // Initial viewer count
    initialCount: 14203,

    // Viewers BEFORE the drop (range)
    beforeDrop: {
      min: 14300,
      max: 12500,
    },

    // Viewers AFTER the drop (range)
    afterDrop: {
      min: 350,
      max: 400,
    },

    // ⏱️ Time in SECONDS when viewer drop occurs
    // (198 seconds = 3 minutes and 18 seconds)
    dropTimeInSeconds: 10,

    // Update interval (in milliseconds)
    updateInterval: 3000,
  },
};

// ═══════════════════════════════════════════════════════════════
// 🎨 THEME CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const themeConfig = {
  // Dark mode toggle
  // true = YouTube Dark Theme (almost black background)
  // false = Light Theme (white background) - DEFAULT
  darkMode: true,
};

// ═══════════════════════════════════════════════════════════════
// 👤 CHANNEL CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const channelConfig = {
  // 🖼️ Profile image URL (optional)
  // Simply name your image "youtube" with any extension (jpg, jpeg, png, gif, webp)
  // Place it in /public/images/ folder
  // The system will automatically detect: youtube.jpg, youtube.jpeg, youtube.png, etc.
  // Or specify a custom path: "/images/your-image.jpg"
  // Leave empty "" to use initials
  profileImageUrl: "youtube",
};

// ═══════════════════════════════════════════════════════════════
// 🔘 CALL TO ACTION BUTTON CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const ctaButtonConfig = {
  // Enable/disable button
  enabled: true,

  // Button text
  text: "Watch Now!",

  // Delay in seconds before button appears
  delayInSeconds: 10,

  // Button link/URL
  link: "https://example.com",

  // 🎨 BUTTON COLOR (choose ONE - set to true)
  color: {
    red: true,
    blue: false,
    gray: false,
    black: false,
    white: false,  // Default
  },

  // ✨ BUTTON EFFECTS (choose ONE or MORE - set to true)
  effects: {
    pulse: false,      // Pulsing effect
    glow: false,      // Glowing border effect
    shake: false,     // Shaking effect
    bounce: true,    // Bouncing effect
    float: false,     // Floating up/down effect
  },

  // 🎯 BUTTON ICON (choose ONE - set to true)
  icon: {
    click: true,       // Click/pointer icon (default)
    gift: false,       // Gift icon
    tag: false,        // Tag icon (offer/discount)
    trending: false,   // Trending up icon (opportunity)
    sparkles: false,   // Sparkles icon (special/highlight)
  },
};

// ═══════════════════════════════════════════════════════════════
// 💬 CHAT CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const chatConfig = {
  // 💬 Chat title
  title: "Live chat",

  // 📌 Top messages label
  topMessagesLabel: "Top messages",

  // 🎨 Message input placeholder
  inputPlaceholder: "Chat...",

  // ⏱️ Interval between comments (in seconds)
  // Set to 1 for comments to appear every 1 second
  // Set to 2 for comments to appear every 2 seconds, etc.
  commentInterval: 1,

  // 🔄 Loop comments
  // If true, after the last comment it will restart from the first one
  // If false, comments stop after the last one
  loopComments: true,
};

// ═══════════════════════════════════════════════════════════════
// 📝 CHAT COMMENTS (SIMPLE LIST WITH TIMING)
// ═══════════════════════════════════════════════════════════════

/**
 * 💡 HOW TO EDIT COMMENTS:
 *
 * Each comment has 2 fields:
 * - user: User name (string)
 * - message: Comment text (string)
 *
 * Comments appear automatically based on the "commentInterval"
 * setting in chatConfig (default: 1 second between each comment)
 *
 * Example:
 * { user: "John Doe", message: "Great stream!" }
 */

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
