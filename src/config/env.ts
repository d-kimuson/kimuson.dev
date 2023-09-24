import { union, literal, parse } from "valibot";

const envSchema = union([
  literal("local"),
  literal("preview"),
  literal("production"),
]);

export const env = parse(envSchema, process.env["ENV"]);
export type Env = typeof env;
