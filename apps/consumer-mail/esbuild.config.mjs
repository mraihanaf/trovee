// esbuild.config.mjs
import { build } from "esbuild";
import { esbuildConfig } from "@trovee/esbuild-config/backend";

await build(esbuildConfig);
