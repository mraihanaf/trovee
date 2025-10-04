import { serve } from "@hono/node-server";
import { Hono } from "hono";
import logger from "@/utils/logger";
import routes from "@/routes/index";

await import("@/utils/load-env");

const app = new Hono();

app.route("/v1", routes);

serve(
    {
        fetch: app.fetch,
        port: parseInt(process.env.PORT!) || 3001,
    },
    (info) => {
        logger.info(`Server is running on http://localhost:${info.port}`);
    },
);
