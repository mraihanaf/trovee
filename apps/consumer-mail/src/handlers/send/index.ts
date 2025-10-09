import welcomeHandler from "@/handlers/send/handler";
import welcomeSchema from "@/handlers/send/schema";

export const subject = "service.mail.send";
export const schema = welcomeSchema;

export default welcomeHandler;
