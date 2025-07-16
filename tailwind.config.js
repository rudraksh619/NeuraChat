module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'bg-flow': 'flow 20s linear infinite',
      },
      keyframes: {
        flow: {
          '0%': { backgroundPosition: '0px 0px' },
          '100%': { backgroundPosition: '60px 60px' },
        },
      },
    },
  },
  plugins: [],
};
