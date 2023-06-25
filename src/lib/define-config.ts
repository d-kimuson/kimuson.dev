import { env, type Env } from "~/config/env";

export const defineConfig = <T extends Record<string, unknown>>(
  config: Record<Env, T>
): T => config[env];
