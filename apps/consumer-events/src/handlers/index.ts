import type { JsMsg } from "nats";
import logger from "@/utils/logger";
import { stringCodec } from "@/nats/connection";
import type { LoadedHandler } from "./loader";

export async function dispatchMessage(
    msg: JsMsg,
    handlers: Map<string, LoadedHandler>,
): Promise<void> {
    const loaded = handlers.get(msg.subject);
    if (!loaded) {
        logger.warn(`No handler for subject ${msg.subject}`);
        msg.term();
        return;
    }

    let data: unknown = undefined;
    try {
        const raw = stringCodec.decode(msg.data);
        data = raw ? JSON.parse(raw) : undefined;
    } catch {
        logger.warn(`Invalid JSON payload for ${msg.subject}`);
        msg.term();
        return;
    }

    if (loaded.schema) {
        const parseResult = loaded.schema.safeParse(data);
        if (!parseResult.success) {
            logger.warn(`Schema validation failed for ${msg.subject}`);
            msg.term();
            return;
        }
        data = parseResult.data;
    }

    try {
        await loaded.handler(msg, data);
        msg.ack();
    } catch (err) {
        logger.error("Handler processing error");
        logger.error(err);
        msg.nak();
    }
}
