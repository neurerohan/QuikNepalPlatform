import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger, defineConfig } from "vite";
import { type Server } from "http";

// Inline vite config to avoid import issues
const viteConfig = defineConfig({
  root: path.resolve(import.meta.dirname, "..", "client"),
  build: {
    outDir: process.env.VERCEL 
      ? path.resolve(import.meta.dirname, "..", "dist")
      : path.resolve(import.meta.dirname, "..", "dist/public"),
    emptyOutDir: true,
    assetsDir: "assets"
  },
});
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: ['localhost', '*'] as string[],
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  const publicPath = path.resolve(process.cwd(), "public");

  if (!fs.existsSync(distPath)) {
    console.warn(`Build directory ${distPath} not found, falling back to serving only from public directory`);
  }

  // Serve static files from the build directory
  app.use(express.static(distPath));
  
  // Explicitly serve static files from the public directory
  app.use(express.static(publicPath));
  
  // Explicitly handle common static files
  app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.resolve(publicPath, "favicon.ico"));
  });
  
  app.get("/robots.txt", (req, res) => {
    res.sendFile(path.resolve(publicPath, "robots.txt"));
  });
  
  app.get("/sitemap.xml", (req, res) => {
    res.sendFile(path.resolve(publicPath, "sitemap.xml"));
  });

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    if (fs.existsSync(path.resolve(distPath, "index.html"))) {
      res.sendFile(path.resolve(distPath, "index.html"));
    } else {
      // If we can't find the built index.html, return a 404 for non-static routes
      res.status(404).send("404 Page Not Found");
    }
  });
}
