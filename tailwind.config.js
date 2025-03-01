/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#61A9B9", // Footer color
        background: "#F8F8F8", // Background color matching the image
        accent: "#AFE3F1", // Button color
        facebook: "#1877F2", // Facebook brand color
        instagram: "#E4405F", // Instagram brand color
        linkedin: "#0A66C2", // LinkedIn brand color
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


