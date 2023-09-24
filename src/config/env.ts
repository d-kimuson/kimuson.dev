import { z } from "zod";

export const env = z
  .union([z.literal("local"), z.literal("production")])
  .parse(process.env.ENV);

export type Env = typeof env;
