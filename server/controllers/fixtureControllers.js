const fixtureModel = require("../models/fixtureModel");

// GET /api/fixtures
module.exports.listFixtures = async (req, res, next) => {
  try {
    const { type } = req.query;

    let fixtures = await fixtureModel.getAll();

    if (type === "upcoming") {
      fixtures = fixtures.filter((f) => f.status === "upcoming");
    }

    if (type === "live") {
      fixtures = fixtures.filter((f) => f.status === "live");
    }

    if (type === "results") {
      fixtures = fixtures.filter((f) => f.status === "finished");
    }

    res.send(fixtures);
  } catch (err) {
    next(err);
  }
};

// GET /api/fixtures/:fixture_id
module.exports.getFixture = async (req, res, next) => {
  try {
    const { fixture_id } = req.params;

    const fixture = await fixtureModel.find(fixture_id);

    if (!fixture) {
      return res.status(404).send({ error: "Fixture not found" });
    }

    res.send(fixture);
  } catch (err) {
    next(err);
  }
};
