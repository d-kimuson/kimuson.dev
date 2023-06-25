import isISO8601 from "validator/lib/isISO8601";
import { z } from "zod";

export const isoString = (): z.ZodEffects<z.ZodString, string, string> =>
  z.string().refine(isISO8601, {
    message: "Not a valid ISO string",
  });
