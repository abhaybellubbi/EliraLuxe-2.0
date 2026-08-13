import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig as defineLovableConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const isVercelBuild = process.env.VERCEL === "1";

export default isVercelBuild
  ? defineConfig({
      plugins: [
        tailwindcss(),
        tsConfigPaths({ projects: ["./tsconfig.json"] }),
        tanstackStart({
          importProtection: {
            behavior: "error",
            client: {
              files: ["**/server/**"],
              specifiers: ["server-only"],
            },
          },
        }),
        nitro({ preset: "vercel" }),
        viteReact(),
      ],
      resolve: {
        alias: {
          "@": `${process.cwd()}/src`,
        },
        dedupe: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "@tanstack/react-query",
          "@tanstack/query-core",
        ],
      },
    })
  : defineLovableConfig({
      vite: {},
    });
