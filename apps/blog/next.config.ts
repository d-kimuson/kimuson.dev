import type { NextConfig } from "next";

class NextEntryPlugin {
  constructor(private name: string) {}

  apply(compiler: any) {
    compiler.hooks.afterEnvironment.tap("NextEntryPlugin", () => {
      compiler.options.resolve.conditionNames = [
        this.name,
        ...compiler.options.resolve.conditionNames,
      ];
    });
  }
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    typedRoutes: true,
  },
  webpack: (config) => ({
    ...config,
    plugins: [...config.plugins, new NextEntryPlugin("@kimuson-dev/src")],
  }),
};

export default nextConfig;
