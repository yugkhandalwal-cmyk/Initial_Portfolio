import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import contactHandler from "./api/contact.js";

function localContactApi() {
  return {
    name: "local-contact-api",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (req, res, next) => {
        const reply = {
          statusCode: 200,
          status(code) {
            this.statusCode = code;
            return this;
          },
          json(payload) {
            res.statusCode = this.statusCode;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(payload));
            return res;
          },
        };

        try {
          const env = loadEnv(server.config.mode, process.cwd(), "");
          for (const key of ["SMTP_USER", "SMTP_PASS", "OWNER_EMAIL"]) {
            if (env[key]) process.env[key] = env[key];
          }
          if (req.method === "POST") {
            const chunks = [];
            let size = 0;
            for await (const chunk of req) {
              size += chunk.length;
              if (size > 10000) {
                res.statusCode = 413;
                res.end(JSON.stringify({ error: "Request is too large." }));
                return;
              }
              chunks.push(chunk);
            }
            try {
              req.body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Invalid request body." }));
              return;
            }
          }
          await contactHandler(req, reply);
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

export default defineConfig({ plugins: [react(), localContactApi()] });
