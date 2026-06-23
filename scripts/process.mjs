import duckdb from "duckdb";
import { writeFileSync } from "fs";

const db = new duckdb.Database(":memory:");
const conn = db.connect();
const FILE = "src/data/trade_i_baci_a_22.parquet";

console.log("Processing 2024 trade data (HS6 → HS4 aggregation)...");

// value is in USD → output millions USD (÷1,000,000)
const sql = `
  SELECT
    exporter_id                                AS iso,
    exporter_name                              AS name,
    SUBSTR(hs_code, 1, 4)                      AS hs4,
    FIRST(product_name)                        AS product_name,
    ROUND(SUM(value) / 1000000.0, 2)          AS value_m
  FROM '${FILE}'
  WHERE year = 2024
  GROUP BY exporter_id, exporter_name, SUBSTR(hs_code, 1, 4)
  ORDER BY exporter_id, value_m DESC
`;

conn.all(sql, (err, rows) => {
  if (err) { console.error(err); process.exit(1); }
  console.log(`Got ${rows.length} country × HS4 rows`);

  const countries = {};
  for (const row of rows) {
    const iso = row.iso;
    if (!countries[iso]) countries[iso] = { name: row.name, total: 0, products: [] };
    countries[iso].total = Math.round((countries[iso].total + row.value_m) * 100) / 100;
    if (countries[iso].products.length < 50) {
      countries[iso].products.push({ code: row.hs4, name: row.product_name, value: row.value_m });
    }
  }

  const products = {};
  for (const row of rows) {
    if (row.value_m < 1) continue;
    if (!products[row.hs4]) products[row.hs4] = { name: row.product_name, exporters: {} };
    products[row.hs4].exporters[row.iso] = row.value_m;
  }

  const sau = countries["sau"];
  if (sau) {
    console.log(`\nSanity check — Saudi Arabia top 3:`);
    sau.products.slice(0, 3).forEach(p =>
      console.log(`  [${p.code}] ${p.name}: $${p.value.toLocaleString()}M`)
    );
    console.log(`  Total: $${sau.total.toLocaleString()}M`);
  }

  const out = { year: 2024, countries, products };
  const json = JSON.stringify(out);
  writeFileSync("public/trade.json", json);
  console.log(`\nWrote public/trade.json (${(json.length / 1024 / 1024).toFixed(1)} MB)`);
  db.close();
});
