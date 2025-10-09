import {
    AckPolicy,
    DeliverPolicy,
    RetentionPolicy,
    type JetStreamManager,
} from "nats";
import logger from "@/utils/logger";
import {
    STREAM_NAME,
    CONSUMER_DURABLE,
    SUBJECT_PATTERN,
    ACK_WAIT_MS,
    MAX_DELIVER,
    MAX_ACK_PENDING,
} from "@/nats/constants";

export async function ensureStreamAndConsumer(
    jm: JetStreamManager,
): Promise<void> {
    await jm.streams
        .add({
            name: STREAM_NAME,
            subjects: [SUBJECT_PATTERN],
            retention: RetentionPolicy.Workqueue,
        })
        .catch(() => logger.info("Streams already exist."));

    await jm.consumers
        .add(STREAM_NAME, {
            durable_name: CONSUMER_DURABLE,
            ack_policy: AckPolicy.Explicit,
            deliver_policy: DeliverPolicy.All,
            filter_subject: SUBJECT_PATTERN,
            max_deliver: MAX_DELIVER,
            ack_wait: ACK_WAIT_MS,
            max_ack_pending: MAX_ACK_PENDING,
        })
        .catch(() => undefined);
}

export async function waitForReady(
    jm: JetStreamManager,
    attempts = 10,
    delayMs = 500,
): Promise<void> {
    for (let i = 0; i < attempts; i++) {
        try {
            await jm.streams.info(STREAM_NAME);
            try {
                await jm.consumers.info(STREAM_NAME, CONSUMER_DURABLE);
                return;
            } catch {
                await jm.consumers
                    .add(STREAM_NAME, {
                        durable_name: CONSUMER_DURABLE,
                        ack_policy: AckPolicy.Explicit,
                        deliver_policy: DeliverPolicy.All,
                        filter_subject: SUBJECT_PATTERN,
                        max_deliver: MAX_DELIVER,
                        ack_wait: ACK_WAIT_MS,
                        max_ack_pending: MAX_ACK_PENDING,
                    })
                    .catch(() => undefined);
            }
        } catch {
            logger.debug(
                "JetStream stream or consumer not ready yet, retrying...",
            );
        }
        await new Promise((r) => setTimeout(r, delayMs));
    }
    throw new Error("JetStream not ready after retries");
}
