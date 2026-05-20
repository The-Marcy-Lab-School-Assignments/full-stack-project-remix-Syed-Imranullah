const leagueModel = require("../models/leagueModel");

// CREATE LEAGUE
module.exports.createLeague = async (req, res, next) => {
  try {
    const { league_name, invite_code } = req.body;
    if (!league_name || !invite_code) {
      return res.status(400).send({ error: "Missing fields" });
    }
    const league = await leagueModel.create(
      league_name,
      invite_code,
      req.session.user_id,
    );
    res.status(201).send(league);
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(400)
        .send({ error: "Invite code already taken. Choose a different one." });
    }
    next(err);
  }
};

// JOIN LEAGUE
module.exports.joinLeague = async (req, res, next) => {
  try {
    const { invite_code } = req.body;

    const league = await leagueModel.findByInviteCode(invite_code);

    if (!league) {
      return res.status(404).send({ error: "League not found" });
    }

    const result = await leagueModel.join(
      req.session.user_id,
      league.league_id,
    );

    res.status(201).send(result);
  } catch (err) {
    next(err);
  }
};

// GET USER LEAGUES
module.exports.getLeagues = async (req, res, next) => {
  try {
    const leagues = await leagueModel.getUserLeagues(req.session.user_id);
    res.send(leagues);
  } catch (err) {
    next(err);
  }
};
module.exports.deleteLeague = async (req, res, next) => {
  try {
    const { league_id } = req.params;
    const deleted = await leagueModel.destroy(league_id, req.session.user_id);
    if (!deleted) {
      return res
        .status(403)
        .send({ error: "Not authorized or league not found." });
    }
    res.send(deleted);
  } catch (err) {
    next(err);
  }
};

module.exports.getLeaderboard = async (req, res, next) => {
  try {
    const { league_id } = req.params;
    const leaderboard = await leagueModel.getLeaderboard(league_id);
    res.send(leaderboard);
  } catch (err) {
    next(err);
  }
};