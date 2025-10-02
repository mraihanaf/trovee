import { Hono } from "hono";

const eventsRouter = new Hono();

eventsRouter.get("/", (c) => {
    return c.text("Hello World!");
});

export default eventsRouter;
