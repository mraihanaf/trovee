import { z } from "zod";

const sendSchema = z.object({
    email: z.string(),
});

export default sendSchema;
