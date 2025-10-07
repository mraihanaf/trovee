import { z } from "zod";

if (process.env.NODE_ENV !== "production") {
    (await import("dotenv")).config();
}

export async function checkEnvironment(): Promise<void> {
    const environmentSchema = z.object({
        NODE_ENV: z.enum(["development", "production"]).optional(),
        LOG_LEVEL: z.enum(["info", "debug", "error", "warn"]).optional(),

        DATABASE_URL: z.string(),

        NATS_SERVERS: z.string(),

        BETTER_AUTH_SECRET: z.string(),
        BETTER_AUTH_URL: z.string(),
        GOOGLE_CLIENT_ID: z.string(),
        GOOGLE_CLIENT_SECRET: z.string(),
    });

    environmentSchema.parse(process.env);
}

export {};
