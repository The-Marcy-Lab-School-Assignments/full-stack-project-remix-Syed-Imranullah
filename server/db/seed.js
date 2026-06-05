const bcrypt = require("bcrypt");
const pool = require("./pool");

const SALT_ROUNDS = 8;

const seed = async () => {
  // Drop tables in reverse dependency order (todos references users via FK)
  // In MatchDay this would reset everything before seeding fresh data:
  // users → leagues → league_members → fixtures → predictions

  await pool.query("DROP TABLE IF EXISTS predictions");
  await pool.query("DROP TABLE IF EXISTS fixtures");
  await pool.query("DROP TABLE IF EXISTS league_members");
  await pool.query("DROP TABLE IF EXISTS leagues");
  await pool.query("DROP TABLE IF EXISTS users");

  // users table stays the same (authentication system is unchanged)
  // this represents players joining MatchDay

  await pool.query(`
  CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )
`);

  await pool.query(`
    CREATE TABLE leagues (
    league_id SERIAL PRIMARY KEY,
    league_name TEXT NOT NULL,
    invite_code TEXT UNIQUE NOT NULL,
    created_by INT REFERENCES users(user_id) ON DELETE CASCADE
  )
  `);

  // in MatchDay, this "todos" table becomes "predictions"
  // instead of simple tasks, each row represents a match prediction:
  // - fixture_id (which match)
  // - prediction (home/draw/away or score)
  // - points (earned after match finishes)
  // - league_id (competition grouping)

  await pool.query(`
    CREATE TABLE league_members (
    member_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    league_id INT REFERENCES leagues(league_id) ON DELETE CASCADE
  )
  `);
  // real soccer fixtures from API-Football
await pool.query(`
  CREATE TABLE fixtures (
    fixture_id SERIAL PRIMARY KEY,
    api_fixture_id INT UNIQUE NOT NULL,
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    match_date TIMESTAMP NOT NULL,
    home_score INT,
    away_score INT,
    winner TEXT,
    status TEXT DEFAULT 'upcoming'
  )
`);
  // user predictions for fixtures
  await pool.query(`
  CREATE TABLE predictions (
    prediction_id SERIAL PRIMARY KEY,
    prediction TEXT NOT NULL,
    points INT DEFAULT 0,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    fixture_id INT REFERENCES fixtures(fixture_id) ON DELETE CASCADE,
    league_id INT REFERENCES leagues(league_id) ON DELETE CASCADE,

    -- prevents duplicate predictions for same match in same league
    UNIQUE(user_id, fixture_id, league_id)
  )
`);
  // Hash passwords in parallel — bcrypt is slow by design (CPU-bound hashing)
  const [aliceHash, bobHash] = await Promise.all([
    bcrypt.hash("password123", SALT_ROUNDS),
    bcrypt.hash("password123", SALT_ROUNDS),
  ]);

  // RETURNING captures inserted user_ids so we don't hardcode them
  const { rows: users } = await pool.query(
    `
    INSERT INTO users (username, password_hash) VALUES
      ('alice', $1),
      ('bob',   $2)
    RETURNING user_id, username
  `,
    [aliceHash, bobHash],
  );

  const [alice, bob] = users;

  // seeding job applications instead of todos
  // just sample data so the UI has something to show

  // In MatchDay this seed section would expand into:
  // - sample leagues (friends groups)
  // - sample fixtures (Arsenal vs Chelsea, etc.)
  // - sample predictions per user
  // - possibly pre-filled leaderboard data
  // sample MatchDay data for testing

// create a sample league
const { rows: leagues } = await pool.query(
  `
  INSERT INTO leagues (league_name, invite_code, created_by)
  VALUES
    ('Premier League Friends', 'MATCH123', $1)
  RETURNING *
`,
  [alice.user_id]
);

const [league] = leagues;

// add users into the league
await pool.query(
  `
  INSERT INTO league_members (user_id, league_id)
  VALUES
    ($1, $3),
    ($2, $3)
`,
  [alice.user_id, bob.user_id, league.league_id]
);

// create fake soccer fixtures
const { rows: fixtures } = await pool.query(
  `
  INSERT INTO fixtures (
    api_fixture_id,
    home_team,
    away_team,
    match_date,
    status
  )
  VALUES
    (1001, 'Arsenal', 'Chelsea', NOW(), 'upcoming'),
    (1002, 'Barcelona', 'Real Madrid', NOW(), 'upcoming')
  RETURNING *
`
);

const [fixtureOne, fixtureTwo] = fixtures;

// create fake predictions
await pool.query(
  `
  INSERT INTO predictions (
    prediction,
    points,
    user_id,
    fixture_id,
    league_id
  )
  VALUES
    ('Arsenal Win', 0, $1, $3, $5),
    ('Draw', 0, $2, $3, $5),
    ('Barcelona Win', 0, $1, $4, $5),
    ('Real Madrid Win', 0, $2, $4, $5)
`,
  [
    alice.user_id,
    bob.user_id,
    fixtureOne.fixture_id,
    fixtureTwo.fixture_id,
    league.league_id,
  ]
);

  return users;
};

seed()
  .then((users) => {
    console.log("Database seeded successfully.");
    console.log(`  Users: ${users.map((u) => u.username).join(", ")}`);
  })
  .catch((err) => {
    console.error("Error seeding database:", err);
    process.exit(1);
  })
  .finally(() => pool.end());
