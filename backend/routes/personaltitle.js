const express = require("express");
const sql = require("mssql");
const config = require("../dbConfig");

const router = express.Router();

// GET by ?code= from Hst_FullName
router.get("/", async (req, res) => {
  try {
    const rawCode = typeof req.query.code === "string" ? req.query.code : "";
    const normalizedCode = rawCode.replace(/\D/g, "").trim();
    let pool = await sql.connect(config);
    let request = pool.request();
    let query;
    if (normalizedCode) {
      request.input("code", sql.NVarChar, normalizedCode);
      query = `
        SELECT [Legal_Code], [Full_Name]
        FROM [${process.env.DB_NAME}].[dbo].[Hst_FullName]
        WHERE REPLACE(REPLACE(LTRIM(RTRIM(CONVERT(NVARCHAR(50), [Legal_Code]))), ' ', ''), '-', '') = @code
      `;
    } else {
      query = `
        SELECT [Legal_Code], [Full_Name]
        FROM [${process.env.DB_NAME}].[dbo].[Hst_FullName]
      `;
    }
    let result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No data found." });
    }

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
