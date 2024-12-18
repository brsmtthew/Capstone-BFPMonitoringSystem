/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['"Kanit"', "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },

    colors: {
      backgroundColor: "#1E1D2A",
      primeColor: "#202020",
      cardHolderColor: "#252736",
      white: "#FFFFFF",
      black: "#000000",
      green: "#90EE90",
      blue: "#0000FF",
      separator: "#02F690",
      separatorLine: "#ABABAB",
      'start-gradient': '#202020', 
      'end-gradient': '#1C3B2E',
      btnActive: "#196244",
      btnFontActive: "#02F690",
      yellow: "#FFD700", 
      histoColor: "#284B63",
      red: "#FF0000",
      solidGreen: "#00FF00",
      gray: "#808080",
      modalCard: "#374151",
      modalButton: "#1F2937",
      tableColor: "#111827",
      searchTable: "#374151",
      offWhite: "#F8FAFB",
      headerDash: "#091057",
      bodyDash: "#FDF7F4",
      bfpNavy: "#010044",
      bfpOrange: "#FF6700",
    }
  },
  plugins: [],
};
