require("dotenv").config();
const express = require("express");
const sql = require("mssql");

const router = express.Router();

// Separate config pointing to the indexation database
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

// GET /api/indexes
// Returns all index rows. Optional query params: ?year=2022&month=2
router.get("/", async (req, res) => {
  let pool;
  try {
    pool = await new sql.ConnectionPool(indexationConfig).connect();
    const request = pool.request();

    let where = "";

    if (req.query.year) {
      request.input("year", sql.Int, Number(req.query.year));
      where += " AND [year] = @year";
    }

    if (req.query.month) {
      request.input("month", sql.Int, Number(req.query.month));
      where += " AND [month] = @month";
    }

    const columnsResult = await pool
      .request()
      .query(`
        SELECT [COLUMN_NAME]
        FROM [${process.env.DB_NAME_INDEXATION}].[INFORMATION_SCHEMA].[COLUMNS]
        WHERE [TABLE_SCHEMA] = 'dbo' AND [TABLE_NAME] = 'indexes'
      `);

    const existingColumns = new Set(
      columnsResult.recordset.map((r) => String(r.COLUMN_NAME).toLowerCase()),
    );

    const bitumColumn = existingColumns.has("bitum_indexes")
      ? "[bitum_indexes]"
      : "NULL AS [bitum_indexes]";
    const dieselColumn = existingColumns.has("diesel_indexes")
      ? "[diesel_indexes]"
      : "NULL AS [diesel_indexes]";

    const query = `
      SELECT [ID], [year], [month], [indexes], ${bitumColumn}, ${dieselColumn}
      FROM [${process.env.DB_NAME_INDEXATION}].[dbo].[indexes]
      WHERE 1=1${where}
      ORDER BY [year], [month]
    `;

    const result = await request.query(query);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
});

module.exports = router;
