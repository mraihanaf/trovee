import logger from "@/utils/logger";
import { RetentionPolicy } from "nats";
import { getConnection } from "@/nats/connection";
import { loadHandlers } from "@/handlers/loader";
import { dispatchMessage } from "@/handlers";
import {
    STREAM_NAME,
    CONSUMER_DURABLE,
    SUBJECT_PATTERN,
} from "@/nats/constants";
import { ensureStreamAndConsumer, waitForReady } from "@/nats/utils";
export default async function setupConsumer() {
    logger.debug("Configuring the consumer...");
    const { jetstreamClient, jetstreamManager } = getConnection();

    await jetstreamManager.streams
        .add({
            name: STREAM_NAME,
            subjects: [SUBJECT_PATTERN],
            retention: RetentionPolicy.Workqueue,
        })
        .catch(() => logger.info("Streams already exist."));

    await ensureStreamAndConsumer(jetstreamManager);

    const handlers = await loadHandlers();

    await waitForReady(jetstreamManager);

    const consumer = await jetstreamClient.consumers.get(
        STREAM_NAME,
        CONSUMER_DURABLE,
    );
    logger.debug("Subscribed to the subjects.");
    const sub = await consumer.consume();

    (async () => {
        for await (const m of sub) {
            try {
                logger.debug(`Received message: ${m.seq} subject=${m.subject}`);
                await dispatchMessage(m, handlers);
            } catch (err) {
                logger.error("Error processing message");
                logger.error(err);
            }
        }
    })();
}
