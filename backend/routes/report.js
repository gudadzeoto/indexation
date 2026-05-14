require("dotenv").config();
const express = require("express");
const sql = require("mssql");

const router = express.Router();

const indexationConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME_INDEXATION,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === "true",
  },
};

// POST /api/report
// Inserts one row per work period into [indexation].[dbo].[report]
router.post("/", async (req, res) => {
  const { contractnum, customer, Legal_Code, Full_Name, rows } = req.body;

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: "rows array is required" });
  }

  try {
    const pool = new sql.ConnectionPool(indexationConfig);
    await pool.connect();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const request = pool.request();

      request.input("printnum", sql.Int, i + 1);
      request.input("contractnum", sql.NVarChar(500), contractnum || null);
      request.input("customer", sql.NVarChar(500), customer || null);
      request.input("year", sql.Int, row.year ? Number(row.year) : null);
      request.input(
        "selectmonth2",
        sql.Int,
        row.month ? Number(row.month) : null,
      );
      request.input("selectnumber2", sql.Int, row.day ? Number(row.day) : null);
      request.input(
        "costofwork",
        sql.Decimal(18, 2),
        row.cost ? Number(row.cost) : null,
      );
      request.input(
        "money",
        sql.Decimal(18, 2),
        row.money ? Number(row.money) : null,
      );
      request.input(
        "index",
        sql.Decimal(18, 3),
        row.index ? Number(row.index) : null,
      );
      request.input(
        "finishInput",
        sql.Decimal(18, 2),
        row.result ? Number(row.result) : null,
      );
      request.input("Legal_Code", sql.NVarChar(50), Legal_Code || null);
      request.input("Full_Name", sql.NVarChar(500), Full_Name || null);
      request.input("Abbreviation", sql.NVarChar(500), Full_Name || null);

      await request.query(`
        INSERT INTO [${process.env.DB_NAME_INDEXATION}].[dbo].[report]
          ([printnum], [contractnum], [customer], [year], [selectmonth2], [selectnumber2],
           [costofwork], [money], [index], [finishInput], [Legal_Code], [Full_Name], [Abbreviation])
        VALUES
          (@printnum, @contractnum, @customer, @year, @selectmonth2, @selectnumber2,
           @costofwork, @money, @index, @finishInput, @Legal_Code, @Full_Name, @Abbreviation)
      `);
    }

    pool.close();
    res.json({ success: true, inserted: rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
