const pool = require("./pool");
require("dotenv").config();

const sync = async () => {
  const endpoints = [
    "https://footballdata.io/api/v1/fixtures/upcoming",
    "https://footballdata.io/api/v1/fixtures/live",
    "https://footballdata.io/api/v1/fixtures/results",
  ];

  let totalCount = 0;

  for (const url of endpoints) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.API_FOOTBALL_KEY}`,
      },
    });

    const json = await response.json();
    const fixtures = json.data?.matches;

    if (!fixtures || !Array.isArray(fixtures) || fixtures.length === 0) {
      console.log(`No fixtures returned from ${url}`);
      continue;
    }

    let count = 0;

    for (const item of fixtures) {
      const id = item.match_id;
      const date = item.match_date;
      const home_team = item.home_team?.team_name;
      const away_team = item.away_team?.team_name;

      if (!id || !home_team || !away_team || !date) continue;

      // 🔥 STATUS LOGIC
      let status = "upcoming";

      if (url.includes("live")) {
        status = "live";
      } else if (url.includes("results")) {
        status = "finished";
      }

      // 🟢 WINNER LOGIC (ADD THIS)
      let winner = null;

      if (url.includes("results") && item.score) {
        const homeScore = item.score?.home;
        const awayScore = item.score?.away;

        if (homeScore > awayScore) winner = "home";
        else if (awayScore > homeScore) winner = "away";
        else winner = "draw";
      }

      // 💾 INSERT / UPDATE FIXTURES
      await pool.query(
        `
        INSERT INTO fixtures (
          api_fixture_id,
          home_team,
          away_team,
          match_date,
          status,
          winner
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (api_fixture_id) DO UPDATE
        SET
          home_team = EXCLUDED.home_team,
          away_team = EXCLUDED.away_team,
          match_date = EXCLUDED.match_date,
          status = EXCLUDED.status,
          winner = EXCLUDED.winner
        `,
        [id, home_team, away_team, date, status, winner]
      );

      count++;
      totalCount++;
    }

    console.log(`Synced ${count} fixtures from ${url}`);
  }

  console.log(`TOTAL fixtures synced: ${totalCount}`);

  pool.end();
};

sync().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});