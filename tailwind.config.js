/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./App.jsx",
  "./index.jsx",
  "./signup.jsx",
  "./languagepage.jsx"
],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}