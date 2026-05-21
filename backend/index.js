const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const config = require("./dbConfig");

const personaltitleRoute = require("./routes/personaltitle");
const indexesRoute = require("./routes/indexes");
const reportRoute = require("./routes/report");
const report1Route = require("./routes/report1");


const app = express();
const PORT = process.env.PORT;

const allowedOrigins = new Set([
  "https://indexation.geostat.ge",
  "http://localhost:5173",
  "http://localhost:5174",
]);

// ✅ IMPORTANT — allow your frontend domain
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

// routes
app.use("/api/personaltitle", personaltitleRoute);
app.use("/api/indexes", indexesRoute);
app.use("/api/report", reportRoute);
app.use("/api/report1", report1Route);

// health check with database status
app.get("/", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    await pool.request().query("SELECT 1");
    pool.close();

    res.json({
      status: "OK",
      message: "API working",
      database: "Connected",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(503).json({
      status: "ERROR",
      message: "API working but database connection failed",
      database: "Disconnected",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
