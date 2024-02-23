const pino = require("pino");
const dayjs = require("dayjs");
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
  timestamp: () => `,"time":"${dayjs().format()}`,
});

module.exports = logger;
