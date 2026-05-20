const cron = require("node-cron");
const pool = require("../db/pool");
require("dotenv").config();

const syncAndScore = async () => {
  console.log("Auto-sync starting:", new Date().toLocaleString());

  try {
    // SYNC RESULTS FROM API
    const response = await fetch(
      "https://footballdata.io/api/v1/fixtures/results",
      {
        headers: {
          Authorization: `Bearer ${process.env.API_FOOTBALL_KEY}`,
        },
      },
    );

    const json = await response.json();
    const fixtures = json.data?.matches;

    if (fixtures && Array.isArray(fixtures)) {
      console.log("sample item:", JSON.stringify(fixtures[0], null, 2));

      for (const item of fixtures) {
        const id = item.match_id;
        const date = item.match_date;
        const home_team = item.home_team?.team_name;
        const away_team = item.away_team?.team_name;

        if (!id || !home_team || !away_team || !date) continue;

        // DETERMINE WINNER
        const homeScore = item.score?.home;
        const awayScore = item.score?.away;

        const winner = item.score?.winner ?? null;

        const status = item.status === "complete" ? "finished" : "upcoming";

        await pool.query(
          `INSERT INTO fixtures (api_fixture_id, home_team, away_team, match_date, status, winner, home_score, away_score)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
   ON CONFLICT (api_fixture_id) DO UPDATE
   SET status = EXCLUDED.status,
       winner = EXCLUDED.winner,
       home_score = EXCLUDED.home_score,
       away_score = EXCLUDED.away_score`,
          [
            item.match_id,
            item.home_team?.team_name,
            item.away_team?.team_name,
            item.match_date,
            item.status === "complete" ? "finished" : "upcoming",
            item.score?.winner ?? null,
            item.score?.home ?? null,
            item.score?.away ?? null,
          ],
        );
      }
      console.log(`Synced ${fixtures.length} results`);
    }

    // SCORE PREDICTIONS
    const { rows: predictions } = await pool.query(`
      SELECT 
        p.prediction_id,
        p.prediction,
        f.winner
      FROM predictions p
      JOIN fixtures f ON p.fixture_id = f.fixture_id
      WHERE f.status = 'finished'
      AND f.winner IS NOT NULL
    `);

    for (const p of predictions) {
      const points = p.prediction === p.winner ? 3 : 0;
      await pool.query(
        `UPDATE predictions SET points = $1 WHERE prediction_id = $2`,
        [points, p.prediction_id],
      );
    }

    console.log(`Scored ${predictions.length} predictions`);
  } catch (err) {
    console.error("Auto-score error:", err);
  }
};

// Run every 5 minutes
cron.schedule("*/5 * * * *", syncAndScore);

console.log("Auto-score job running every 5 minutes");

module.exports = syncAndScore;
