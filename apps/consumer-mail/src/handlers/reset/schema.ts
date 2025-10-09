import { z } from "zod";

const resetSchema = z.object({
    email: z.string(),
});

export default resetSchema;
