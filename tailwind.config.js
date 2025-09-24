module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Core Palette
        primary: '#4A90E2',       // Soft Blue
        secondary: '#FF6B6B',     // Coral / Peach
        accent: '#7ED6A0',        // Mint Green
        background: '#FAFAFA',    // Light Cream
        textPrimary: '#333333',   // Dark Gray
        textSecondary: '#777777', // Soft Gray

        // Mood Colors
        mood: {
          happy: '#FFD93D',       // Sunshine Yellow
          calm: '#7ED6A0',        // Mint Green
          sad: '#6C5CE7',         // Soft Purple
          stressed: '#FF6B6B',    // Coral
          neutral: '#4A90E2',     // Soft Blue
        },

        // Gradient example for charts
        gradientMoodStart: '#FFD93D',
        gradientMoodMid1: '#FF6B6B',
        gradientMoodMid2: '#7ED6A0',
        gradientMoodEnd: '#4A90E2',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Merriweather', 'ui-serif', 'Georgia'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 15px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};



