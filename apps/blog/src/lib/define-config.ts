import { type Output, type BaseSchema, safeParse } from "valibot";
import { env, type Env } from "~/config/env";

export const defineConfig = <T extends Record<string, unknown>>(
  config: Record<Env, T>
): T => config[env];

export const defineConfigWithSchema = <
  S extends BaseSchema<any, any>,
  C = Output<S>,
>(
  schema: S,
  input: Record<Env, unknown>
): C => {
  const target = input[env];

  const parsed = safeParse(schema, target);
  if (!parsed.success) {
    throw new Error("Config Validation Error.");
  }

  return parsed.output;
};
