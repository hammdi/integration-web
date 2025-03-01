
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {


      colors: {
        primary: "#61A9B9",
        background: "#F8F8F8",
        accent: "#AFE3F1",
        facebook: "#1877F2", // Facebook brand color
        instagram: "#E4405F", // Instagram brand color
        linkedin: "#0A66C2", // LinkedIn brand color
      },

      fontFamily: {
        'ubuntu': ['Ubuntu Sans', 'sans-serif'],
      },

      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        'xl': '12px',
      },
      boxShadow: {
        'custom': '0 4px 10px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
