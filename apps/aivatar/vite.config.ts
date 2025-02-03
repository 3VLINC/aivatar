import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    allowedHosts: ["dev.3vl.ca", "localhost"],
    https: {
      key: readFileSync(resolve(__dirname, './dev/origin.key')),
      cert: readFileSync(resolve(__dirname, './dev/origin.cert')),
    },
    port: 8443,
    proxy: {
      // ...
    },
    fs: {
      allow: [
        resolve(__dirname, '../../node_modules'),
        resolve(__dirname)
      ]
    }
  }
});
