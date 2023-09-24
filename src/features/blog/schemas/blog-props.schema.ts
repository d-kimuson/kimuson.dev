import { object, array, string, type Output } from "valibot";
import { headingSchema } from "~/domain-object/heading";

export const blogPropsSchema = object({
  url: string(),
  headings: array(headingSchema),
});

export type BlogPropsSchema = Output<typeof blogPropsSchema>;
