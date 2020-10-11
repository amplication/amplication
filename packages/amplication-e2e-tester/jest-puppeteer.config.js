module.exports = {
  launch: {
    product: "chrome",
    headless: process.env.HEADLESS !== "false",
    slowMo: process.env.SLOW_MO && Number(process.env.SLOW_MO),
    defaultViewport: {
      width: 1024,
      height: 768,
    },
  },
};
