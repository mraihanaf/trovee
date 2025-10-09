import { readdir } from "fs/promises";
import * as path from "path";
import { pathToFileURL, fileURLToPath } from "url";
import type { JsMsg } from "nats";
import logger from "@/utils/logger";
import type { z } from "zod";

type LoadedModule = {
    subject: string;
    schema?: z.ZodTypeAny;
    default: (msg: JsMsg, data: unknown) => Promise<void> | void;
};

export type LoadedHandler = {
    subject: string;
    schema?: z.ZodTypeAny;
    handler: LoadedModule["default"];
};

export async function loadHandlers(): Promise<Map<string, LoadedHandler>> {
    logger.debug("Loading handlers...");
    const __filename = fileURLToPath(import.meta.url);
    const __dirnameLocal = path.dirname(__filename);
    const handlersDir = path.resolve(__dirnameLocal);
    const subjectsToHandlers = new Map<string, LoadedHandler>();

    const entries = await readdir(handlersDir, { withFileTypes: true });
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const candidate = path.join(handlersDir, entry.name, "index");

        const possibleExtensions = [".js", ".ts"];
        for (const ext of possibleExtensions) {
            try {
                const moduleUrl = pathToFileURL(candidate + ext).href;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore - dynamic import path
                const mod: Partial<LoadedModule> = await import(moduleUrl);
                if (mod && mod.subject && typeof mod.default === "function") {
                    logger.info(`Loaded ${mod.subject} handler`);
                    subjectsToHandlers.set(mod.subject, {
                        subject: mod.subject,
                        schema: mod.schema as z.ZodTypeAny | undefined,
                        handler: mod.default as LoadedModule["default"],
                    });
                    break;
                }
            } catch {
                // ignore
            }
        }
    }

    return subjectsToHandlers;
}
