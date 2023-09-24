import { object, number, integer, string, type Output } from "valibot";

export const headingSchema = object({
  depth: number([integer()]),
  slug: string(),
  text: string(),
});

export type Heading = Output<typeof headingSchema>;
