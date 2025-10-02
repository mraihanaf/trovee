import { Hono } from "hono";

const certificatesRouter = new Hono();

certificatesRouter.get("/", (c) => {
    return c.text("Hello World!");
});

export default certificatesRouter;
