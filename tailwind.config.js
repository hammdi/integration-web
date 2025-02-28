
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        'pharma-bg': "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1939309.png-5J5VQ1RfPcMSLZUW3phS1k3NwuLPls.webp')",
      },
      colors: {
        primary: "#61A9B9",
        background: "#F8F8F8",
        accent: "#AFE3F1",
        sidebar: "#AFE3F1",
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        'xl': '12px',
      },
      boxShadow: {
        'custom': '0 4px 10px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
