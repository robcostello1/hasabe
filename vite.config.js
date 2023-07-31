import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      onLog: (level, log, handler) => {
        if (
          log.message.match(/browser-ponyfill\.js.+@supabase/) ||
          log.message.match(
            /Circular dependency.+(react-md-editor|hast-util-select)/
          )
        ) {
          return;
        }

        handler(level, log);
      },
      onwarn: (warning) => {
        console.log("Warning:", warning);
      },
    },
  },
});
