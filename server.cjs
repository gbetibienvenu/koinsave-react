const path = require("path");
const express = require("express");
const { createServer } = require("http");
const jsonServer = require("json-server");

const app = express();
const httpServer = createServer(app);

// JSON server setup
const apiRouter = jsonServer.router(path.join(__dirname, "db.json"));

const middlewares = jsonServer.defaults({
  static: path.join(__dirname, "public")
});

app.use("/api", middlewares);
app.use("/api", jsonServer.bodyParser);

// CORS
app.use("/api", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
----------------------------------------------------
⭐ CUSTOM LOGIN ENDPOINT (this FIXES the login error)
----------------------------------------------------
*/
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Load DB manually
  const db = apiRouter.db; // lowdb instance
  const users = db.get("users").value();

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Do NOT send password back!
  const safeUser = { ...user };
  delete safeUser.password;

  res.json({
    message: "Login successful",
    user: safeUser
  });
});

// JSON SERVER ROUTES
app.use("/api", apiRouter);

// Serve Vite build output
const buildPath = path.join(__dirname, "dist");
app.use(express.static(buildPath));

// FIX for Express 5 wildcard route
app.get(/.*/, (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(buildPath, "index.html"));
});

// START server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// const path = require("path");
// const express = require("express");
// const { createServer } = require("http");
// const jsonServer = require("json-server");

// const app = express();
// const httpServer = createServer(app);

// // ===== JSON SERVER API =====
// const apiRouter = jsonServer.router(path.join(__dirname, "db.json"));

// app.use("/api", jsonServer.defaults());
// app.use("/api", jsonServer.bodyParser);

// // CORS
// app.use("/api", (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
//   next();
// });

// app.use("/api", apiRouter);

// // ===== SERVE FRONTEND =====
// const buildPath = path.join(__dirname, "dist");
// app.use(express.static(buildPath));

// // FIX FOR EXPRESS 5 — SAFE REGEXP
// app.get(/.*/, (req, res) => {
//   if (req.path.startsWith("/api")) {
//     return res.status(404).json({ error: "API route not found" });
//   }

//   res.sendFile(path.join(buildPath, "index.html"));
// });

// // ===== START SERVER =====
// const PORT = process.env.PORT || 4000;
// httpServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// const path = require("path");
// const express = require("express");
// const { createServer } = require("http");
// const jsonServer = require("json-server");

// const app = express();
// const httpServer = createServer(app);

// // JSON server setup
// const apiRouter = jsonServer.router(path.join(__dirname, "db.json"));

// // json-server v1 requires static folder
// const middlewares = jsonServer.defaults({
//   static: path.join(__dirname, "public")
// });

// // API
// app.use("/api", middlewares);
// app.use("/api", jsonServer.bodyParser);

// app.use("/api", (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// app.use("/api", apiRouter);

// // Serve Vite dist folder
// const buildPath = path.join(__dirname, "dist");
// app.use(express.static(buildPath));

// // ⭐ FIXED FOR EXPRESS 5 ⭐
// // Instead of app.get("*"), we use a REGEXP that does not break
// app.get(/.*/, (req, res) => {
//   // If API path → let API handle it (not frontend)
//   if (req.path.startsWith("/api")) {
//     return res.status(404).json({ error: "API route not found" });
//   }

//   res.sendFile(path.join(buildPath, "index.html"));
// });

// // Start server
// const PORT = process.env.PORT || 4000;
// httpServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
