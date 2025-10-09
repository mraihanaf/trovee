import logger from "@/utils/logger";
import { checkEnvironment } from "@/utils/load-env";
import { initConnection, setupConsumer, getConnection } from "@/nats";
import { ZodError } from "zod";

export async function start(): Promise<void> {
    logger.info("Starting events consumer service...");

    try {
        await checkEnvironment();
    } catch (error) {
        if (error instanceof ZodError) {
            const missing = error.issues
                .map((issue) => issue.path.join("."))
                .join(", ");
            logger.error(
                `Missing or invalid environment variables: ${missing}`,
            );
        } else {
            logger.error(
                `Unexpected error while checking environment: ${(error as Error).message}`,
            );
        }
        process.exit(1);
    }

    await initConnection();
    await setupConsumer();

    let isShuttingDown = false;
    const shutdown = async (signal: string) => {
        if (isShuttingDown) return;
        isShuttingDown = true;
        try {
            logger.info(`Received ${signal}. Draining NATS connection...`);
            const { natsConnection } = getConnection();
            await natsConnection.drain();
            logger.info("NATS connection drained. Exiting.");
        } catch (err) {
            logger.fatal("Error during drain");
            logger.error(err);
        } finally {
            process.exit(0);
        }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    logger.info(
        "Events consumer service started successfully, listening to messages..",
    );
}

export function installProcessGuards(): void {
    process.on("unhandledRejection", (reason) => {
        logger.fatal(reason as Error);
    });

    process.on("uncaughtException", (err) => {
        logger.fatal(err);
        process.exit(1);
    });
}
