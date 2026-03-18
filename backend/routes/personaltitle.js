const express = require("express");
const sql = require("mssql");
const config = require("../dbConfig");

const router = express.Router();

// GET by ?code= from Hst_FullName
router.get("/", async (req, res) => {
  try {
    const { code } = req.query;
    let pool = await sql.connect(config);
    let request = pool.request();
    let query;
    if (code) {
      request.input("code", sql.NVarChar, code);
      query = `
        SELECT [Legal_Code], [Full_Name]
        FROM [register].[dbo].[Hst_FullName]
        WHERE [Legal_Code] = @code
      `;
    } else {
      query = `
        SELECT [Legal_Code], [Full_Name]
        FROM [register].[dbo].[Hst_FullName]
      `;
    }
    let result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).send("No data found.");
    }

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
