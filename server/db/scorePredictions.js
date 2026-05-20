const pool = require("./pool");

const scorePredictions = async () => {
  const { rows: predictions } = await pool.query(`
    SELECT 
      p.prediction_id,
      p.prediction,
      p.points,
      f.winner
    FROM predictions p
    JOIN fixtures f
      ON p.fixture_id = f.fixture_id
    WHERE f.status = 'finished'
  `);

  for (const p of predictions) {
    let points = 0;

    // correct prediction = 3 points
    if (p.prediction === p.winner) {
      points = 3;
    }

    await pool.query(
      `
      UPDATE predictions
      SET points = $1
      WHERE prediction_id = $2
      `,
      [points, p.prediction_id]
    );
  }

  console.log("Scoring complete");
  pool.end();
};

scorePredictions().catch((err) => {
  console.error(err);
  pool.end();
});