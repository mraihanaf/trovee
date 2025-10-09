import { z } from "zod";

const welcomeSchema = z.object({
    email: z.string(),
});

export default welcomeSchema;
