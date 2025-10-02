import certificatesRouter from "@/modules/certificates/controller";
import eventsRouter from "@/modules/events/controller";
import { Hono } from "hono";

const routes = new Hono();

routes.route("/events", eventsRouter);
routes.route("/certificates", certificatesRouter);

export default routes;
