import resetHandler from "@/handlers/reset/handler";
import resetSchema from "@/handlers/reset/schema";

export const subject = "service.mail.send.reset";
export const schema = resetSchema;

export default resetHandler;
