export const STREAM_NAME = "MAIL";
export const CONSUMER_DURABLE = "mail-consumer";
export const SUBJECT_PATTERN = "service.mail.send.*";
export const ACK_WAIT_MS = 15_000;
export const MAX_DELIVER = 5;
export const MAX_ACK_PENDING = 500;
