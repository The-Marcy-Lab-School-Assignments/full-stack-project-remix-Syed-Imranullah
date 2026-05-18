const fixtureModel = require("../models/fixtureModel");

// GET /api/fixtures
module.exports.listFixtures = async (req, res, next) => {
  try {
    const fixtures = await fixtureModel.getAll();
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