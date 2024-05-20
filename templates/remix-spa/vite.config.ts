import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      port: Number(env.VITE_DEV_PORT),
    },
    plugins: [
      remix({
        ssr: false,
      }),
      tsconfigPaths(),
    ],
  };
});
