import deleteHandler from "@/handlers/delete/handler";
import deleteSchema from "@/handlers/delete/schema";

export const subject = "service.events.delete";
export const schema = deleteSchema;

export default deleteHandler;
