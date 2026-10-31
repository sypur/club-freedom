import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite-plus";

const ignorePatterns = [
  "**/dist",
  "**/_generated",
  "**/components/ui",
  "**/components/editor",
  "app/routeTree.gen.ts",
];

export default defineConfig(({ mode, command }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, loadedEnv);

  void import("./env/client");

  if (command === "build" && mode === "production") {
    void import("./env/build");
  }

  if (command === "serve") {
    void import("./env/server");
  }

  return {
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
      https: {
        key: "./certificates/dev-key.pem",
        cert: "./certificates/dev.pem",
      },
    },
    plugins: [
      devtools(),
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      tailwindcss(),
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
    fmt: {
      ignorePatterns,
      useTabs: false,
      tabWidth: 2,
      printWidth: 80,
      singleQuote: false,
    },
    lint: {
      ignorePatterns,
      plugins: ["typescript", "unicorn", "oxc", "react", "jsx-a11y"],
      categories: {
        correctness: "error",
        suspicious: "warn",
      },
      rules: {
        "jsx-a11y/media-has-caption": "off",
        "jsx-a11y/prefer-tag-over-role": "off",
        "react/react-in-jsx-scope": "off",
      },
      options: {
        typeAware: true,
        typeCheck: true,
      },
    },
    staged: {
      "*.{js,jsx,ts,tsx,css,json}": "vp check --fix",
    },
  };
});
