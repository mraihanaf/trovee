import { pino } from "pino";
await import("@/utils/load-env");

const logger = pino({
    name: "consumer-events",
    level: process.env.LOG_LEVEL || "info",
    transport:
        process.env.NODE_ENV !== "production"
            ? {
                  target: "pino-pretty",
                  options: {
                      colorize: true,
                      translateTime: "SYS:standard",
                  },
              }
            : undefined,
});

export default logger;
