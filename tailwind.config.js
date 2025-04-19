module.exports = {
  content: [
    "./index.html", 
    './src/**/*.{html,js,jsx,ts,tsx}',  // Tailwind によるクラスの使用を検出するファイルのパス
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};