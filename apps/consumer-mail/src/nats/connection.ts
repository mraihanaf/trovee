import logger from "@/utils/logger";
import {
    connect,
    StringCodec,
    type JetStreamManager,
    type JetStreamClient,
    type NatsConnection,
} from "nats";
await import("@/utils/load-env");

export const stringCodec = StringCodec();

let natsConnection: NatsConnection;
let jetstreamClient: JetStreamClient;
let jetstreamManager: JetStreamManager;

interface IConnection {
    natsConnection: NatsConnection;
    jetstreamClient: JetStreamClient;
    jetstreamManager: JetStreamManager;
}

export default async function initConnection(): Promise<IConnection> {
    logger.debug("Initializing the connection...");
    natsConnection = await connect({
        servers: process.env.NATS_URL,
    });

    jetstreamClient = natsConnection.jetstream();
    jetstreamManager = await natsConnection.jetstreamManager();

    logger.info(`Connected to NATS at ${natsConnection.getServer()}`);

    return { natsConnection, jetstreamClient, jetstreamManager };
}

export function getConnection(): IConnection {
    if (!natsConnection)
        throw new Error("Nats Connection not initialized yet.");
    return { natsConnection, jetstreamClient, jetstreamManager };
}
