import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const payloadAdminTarget = "http://localhost:3001";

function payloadAdminRedirect() {
  return {
    name: "payload-admin-redirect",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/admin")) {
          res.statusCode = 307;
          res.setHeader("Location", `${payloadAdminTarget}${req.url}`);
          res.end();
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [payloadAdminRedirect(), react()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: payloadAdminTarget,
        changeOrigin: true,
      },
      "/_next": {
        target: payloadAdminTarget,
        changeOrigin: true,
      },
      "/media": {
        target: payloadAdminTarget,
        changeOrigin: true,
      },
    },
  },
});
