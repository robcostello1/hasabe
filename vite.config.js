import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

console.log("CI =", process.env.CI);

// https://vitejs.dev/config/
export default defineConfig((config) => {
  console.log(config);
  return {
    ...config,
    plugins: [...config.plugins, react(), viteTsconfigPaths(), svgrPlugin()],
    build: {
      ...config.build,
      chunkSizeWarningLimit: 3000,
    },
  };
});
