/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // LeetCode-inspired colors
        'leetcode-easy': '#00b8a3',
        'leetcode-medium': '#ffc01e',
        'leetcode-hard': '#ef4743',
      },
      fontFamily: {
        // LeetCode-style monospace fonts for code feel
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
