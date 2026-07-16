const cron = require("node-cron");
const pool = require("../db/pool");
require("dotenv").config();

const apiFetch = async (endpoint) => {
  const response = await fetch(`https://footballdata.io/api/v1/fixtures/${endpoint}`, {
    headers: { Authorization: `Bearer ${process.env.API_FOOTBALL_KEY}` },
  });
  const json = await response.json();
  return json.data?.matches || [];
};

const upsertFixture = (id, home, away, date, status, winner, homeScore, awayScore) =>
  pool.query(
    `INSERT INTO fixtures (api_fixture_id, home_team, away_team, match_date, status, winner, home_score, away_score)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (api_fixture_id) DO UPDATE
     SET home_team    = EXCLUDED.home_team,
         away_team    = EXCLUDED.away_team,
         match_date   = EXCLUDED.match_date,
         status       = EXCLUDED.status,
         winner       = EXCLUDED.winner,
         home_score   = EXCLUDED.home_score,
         away_score   = EXCLUDED.away_score`,
    [id, home, away, date, status, winner, homeScore, awayScore]
  );

const syncAndScore = async () => {
  console.log("Auto-sync starting:", new Date().toLocaleString());

  try {
    // SYNC UPCOMING FIXTURES
    const upcoming = await apiFetch("upcoming");
    for (const item of upcoming) {
      const home = item.home_team?.team_name;
      const away = item.away_team?.team_name;
      if (!item.match_id || !home || !away || !item.match_date) continue;
      await pool.query(
        `INSERT INTO fixtures (api_fixture_id, home_team, away_team, match_date, status, winner, home_score, away_score)
         VALUES ($1, $2, $3, $4, 'upcoming', NULL, NULL, NULL)
         ON CONFLICT (api_fixture_id) DO UPDATE
         SET home_team  = EXCLUDED.home_team,
             away_team  = EXCLUDED.away_team,
             match_date = EXCLUDED.match_date,
             status     = CASE WHEN fixtures.status = 'finished' THEN 'finished' ELSE 'upcoming' END`,
        [item.match_id, home, away, item.match_date]
      );
    }
    console.log(`Synced ${upcoming.length} upcoming fixtures`);

    // SYNC LIVE FIXTURES
    const live = await apiFetch("live");
    for (const item of live) {
      const home = item.home_team?.team_name;
      const away = item.away_team?.team_name;
      if (!item.match_id || !home || !away || !item.match_date) continue;
      await pool.query(
        `INSERT INTO fixtures (api_fixture_id, home_team, away_team, match_date, status, winner, home_score, away_score)
         VALUES ($1, $2, $3, $4, 'live', NULL, NULL, NULL)
         ON CONFLICT (api_fixture_id) DO UPDATE
         SET status     = CASE WHEN fixtures.status = 'finished' THEN 'finished' ELSE 'live' END,
             home_score = EXCLUDED.home_score,
             away_score = EXCLUDED.away_score`,
        [item.match_id, home, away, item.match_date]
      );
    }
    console.log(`Synced ${live.length} live fixtures`);

    // SYNC RESULTS
    const results = await apiFetch("results");
    for (const item of results) {
      const home = item.home_team?.team_name;
      const away = item.away_team?.team_name;
      if (!item.match_id || !home || !away || !item.match_date) continue;

      const homeScore = item.score?.home ?? null;
      const awayScore = item.score?.away ?? null;
      let winner = null;
      if (homeScore !== null && awayScore !== null) {
        if (homeScore > awayScore) winner = "home";
        else if (awayScore > homeScore) winner = "away";
        else winner = "draw";
      }

      await upsertFixture(item.match_id, home, away, item.match_date, "finished", winner, homeScore, awayScore);
    }
    console.log(`Synced ${results.length} results`);

    // SCORE PREDICTIONS
    const { rows: predictions } = await pool.query(`
      SELECT p.prediction_id, p.prediction, f.winner
      FROM predictions p
      JOIN fixtures f ON p.fixture_id = f.fixture_id
      WHERE f.status = 'finished' AND f.winner IS NOT NULL
    `);

    for (const p of predictions) {
      const points = p.prediction === p.winner ? 3 : 0;
      await pool.query(`UPDATE predictions SET points = $1 WHERE prediction_id = $2`, [points, p.prediction_id]);
    }
    console.log(`Scored ${predictions.length} predictions`);
  } catch (err) {
    console.error("Auto-score error:", err);
  }
};

cron.schedule("*/5 * * * *", syncAndScore);
console.log("Auto-score job running every 5 minutes");

module.exports = syncAndScore;
