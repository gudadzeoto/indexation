const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const config = require("./dbConfig");

const personaltitleRoute = require("./routes/personaltitle");


const app = express();
const PORT = process.env.PORT;

// ✅ IMPORTANT — allow your frontend domain
const corsOptions = {
  origin: [
    "https://indexation.geostat.ge",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

// routes
app.use("/api/personaltitle", personaltitleRoute);

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
