import logger from "@/utils/logger";
import { checkEnvironment } from "./utils/load-env";
import { ZodError } from "zod";

await import("./utils/load-env");

async function main() {
    logger.info("Starting aggregator-events...");

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

    logger.info("Aggregator-events started successfully");
}

main().catch((error) => {
    logger.fatal(error);
    process.exit(1);
});
