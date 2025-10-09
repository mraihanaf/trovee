import createHandler from "@/handlers/create/handler";
import createSchema from "@/handlers/create/schema";

export const subject = "service.events.create";
export const schema = createSchema;

export default createHandler;
