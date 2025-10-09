import welcomeHandler from "@/handlers/welcome/handler";
import welcomeSchema from "@/handlers/welcome/schema";

export const subject = "service.mail.send.welcome";
export const schema = welcomeSchema;

export default welcomeHandler;
