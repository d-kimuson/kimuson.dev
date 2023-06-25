import { z } from "zod";

export const headingSchema = z.object({
  depth: z.number().int(),
  slug: z.string(),
  text: z.string(),
});

export type Heading = z.infer<typeof headingSchema>;
