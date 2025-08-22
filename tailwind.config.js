/** @type {import('tailwindcss').Config} */
module.exports = {
  // IMPORTANT: Add the NativeWind preset
  presets: [require("nativewind/preset")],
  
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#001414ff',
        secondary: '#1414ff',
        light: {
          100: '#D6C6FF',
          200: '#A8B5DB',
          300: '#9CA4AB',
        },
        dark: {
          100: '#221f3d',
          200: '#0f0d23'
        },
        accent: '#abdbffff'
      }
    },
  },
  plugins: [],
}