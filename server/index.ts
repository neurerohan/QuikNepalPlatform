import express from "express";
import { createServer as createHttpServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse: any = undefined;
  const originalResJson = res.json;
  res.json = function(bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\\u2026";
      }
      log(logLine);
    }
  });
  next();
});

async function initializeApp() {
  const httpServer = await registerRoutes(app);

  app.use((err: any, _req: any, res: any, _next: any) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Global error handler:", err);
    res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  if (!process.env.VERCEL) {
    const port = process.env.PORT || 5000;
    httpServer.listen({
      port: Number(port),
      host: "0.0.0.0",
    }, () => {
      log(`Server listening on port ${port}`);
    });
  }
}

initializeApp().catch(error => {
  console.error("Failed to initialize app:", error);
  process.exit(1);
});

export default app;
