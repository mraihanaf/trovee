import { serve } from "@hono/node-server";
import { Hono } from "hono";
import logger from "@/utils/logger";
import routes from "@/routes/index";
import { checkEnvironment } from "@/utils/load-env";
import { ZodError } from "zod";

await import("@/utils/load-env");

async function main() {
    logger.info("Strating backend service...");

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

    const app = new Hono();
    app.route("/v1", routes);

    serve(
        {
            fetch: app.fetch,
            port: parseInt(process.env.PORT!) || 3001,
        },
        (info) => {
            logger.info(
                `Backend server is running on http://localhost:${info.port}`,
            );
        },
    );
}

main().catch((error) => {
    logger.fatal(error);
    process.exit(1);
});
