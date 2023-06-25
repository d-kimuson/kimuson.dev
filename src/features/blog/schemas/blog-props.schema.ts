import { z } from "zod"
import { headingSchema } from "~/domain-object/heading"

export const blogPropsSchema = z.object({
  url: z.string(),
  headings: z.array(headingSchema),
})

export type BlogPropsSchema = z.infer<typeof blogPropsSchema>
