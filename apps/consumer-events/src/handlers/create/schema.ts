import { z } from "zod";

const createSchema = z.object({ id: z.string() });

export default createSchema;
