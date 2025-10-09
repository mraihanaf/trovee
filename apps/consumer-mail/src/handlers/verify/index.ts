import verifyHandler from "@/handlers/verify/handler";
import verifySchema from "@/handlers/verify/schema";

export const subject = "service.mail.send.verify";
export const schema = verifySchema;

export default verifyHandler;
