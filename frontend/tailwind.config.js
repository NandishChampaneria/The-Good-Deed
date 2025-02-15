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
      {
        // mytheme: {        
        //   "primary": "#FAE588",   // Soft Pastel Yellow  
        //   "secondary": "#FCE57E", // Warm Golden Yellow  
        //   "accent": "#FADF63",    // Light Golden Glow  
        //   "neutral": "#FEF7D8",   // Pale Cream Beige  
        //   "base-100": "#FFFAE5",  // Almost White Soft Yellow  
        //   "info": "#FFF3B0",      // Light Buttercream           
        //   "success": "#10b981",             
        //   "warning": "#eab308",             
        //   "error": "#ff0000",
        // },
        // mytheme2: {
        //   "primary": "white",   // Soft Sky Blue
        //   "primary-content": "black", //
        //   "secondary": "#BFDBFE", // Light Pastel Blue
        //   "accent": "white",    // Gentle Azure Blue
        //   "base-200": "rgb(223, 228, 238)", //
        //   "base-content": "#b7c1d2",
        //   "neutral": "#E0F2FE",   // Pale Ice Blue
        //   "base-100": "transparent",  // Near White
        //   "info": "#7DD3FC",      // Baby Blue
        //   "success": "#81C784", // Soft green
        //   "warning": "#FFA726", // Warm amber
        //   "error": "#FF6B6B", // Soft red
        // },
        mytheme: {
          "primary": "white",   // Soft Sky Blue
          "primary-content": "black", //
          "secondary": "#F4D793", // Light Pastel Blue
          "accent": "white",    // Gentle Azure Blue
          "base-200": "rgb(223, 228, 238)", //
          "base-content": "#b7c1d2",
          "neutral": "#FADA7A",   // Pale Ice Blue
          "base-100": "transparent",  // Near White
          "info": "#7DD3FC",      // Baby Blue
          "success": "#81C784", // Soft green
          "warning": "#FFA726", // Warm amber
          "error": "#FF6B6B", // Soft red
        }
      },
      // "night",
    ]
  }
}