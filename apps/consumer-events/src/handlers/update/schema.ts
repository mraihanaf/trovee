import { z } from "zod";

const updateSchema = z.object({ id: z.string() });

export default updateSchema;
