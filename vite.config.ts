import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode, command }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, loadedEnv);

  import("./env/client");

  if (command === "build" && mode === "production") {
    import("./env/build");
  }

  if (command === "serve") {
    import("./env/server");
  }

  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
      https: {
        key: "./certificates/dev-key.pem",
        cert: "./certificates/dev.pem",
      },
    },
    plugins: [
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      tailwindcss(),
      tsconfigPaths(),
      tanstackStart({
        srcDirectory: "app",
        router: {
          routesDirectory: "routes",
        },
      }),
      viteReact(),
    ],
    build: {
      sourcemap: "hidden",
      ...(mode === "production" && {
        rolldownOptions: {
          output: {
            minify: {
              compress: {
                dropConsole: true,
              },
            },
          },
        },
      }),
    },
    ssr: {
      noExternal: ["@convex-dev/better-auth"],
    },
  };
});
