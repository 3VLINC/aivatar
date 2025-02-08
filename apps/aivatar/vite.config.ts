import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const getHttps = () => {
  try {

    return {
      key: readFileSync(resolve(__dirname, './dev/origin.key')),
      cert: readFileSync(resolve(__dirname, './dev/origin.cert')),
    }
  } catch (e) {
    return undefined;
  }
}
export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    allowedHosts: ["dev.3vl.ca", "aivatar.3vl.ca", "localhost"],
    https: getHttps(),
    port: 443,
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
