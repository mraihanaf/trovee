export const esbuildConfig = {
    entryPoints: ["src/index.ts"],
    outdir: "dist",
    platform: "node",
    format: "esm",
    sourcemap: true,
    bundle: true,
    target: ["node22"],
    alias: {
      "@": "./src",
    },
  }