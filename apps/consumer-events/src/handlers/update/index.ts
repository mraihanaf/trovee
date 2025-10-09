import updateHandler from "@/handlers/update/handler";
import updateSchema from "@/handlers/update/schema";

export const subject = "service.events.update";
export const schema = updateSchema;

export default updateHandler;
