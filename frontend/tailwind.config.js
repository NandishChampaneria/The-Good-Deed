import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      "forest",
      "aqua",
      "night",
      {
        mytheme: {        
          "primary": "#f3f4f6", 
          "secondary": "#f3f4f6",                
          "accent": "#f3f4f6",               
          "neutral": "#f3f4f6",            
          "base-100": "#111827",            
          "info": "#374151",             
          "success": "#10b981",             
          "warning": "#eab308",             
          "error": "#ff0000",
        },
      },
    ]
  }
}