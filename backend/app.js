const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const { getStorageMode } = require("./data/store");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*"
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    storage: getStorageMode()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const frontendBuildPath = path.join(__dirname, "..", "frontend", "build");
const frontendIndexPath = path.join(frontendBuildPath, "index.html");

if (fs.existsSync(frontendIndexPath)) {
  app.use(express.static(frontendBuildPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    return res.sendFile(frontendIndexPath);
  });
}

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

module.exports = app;
