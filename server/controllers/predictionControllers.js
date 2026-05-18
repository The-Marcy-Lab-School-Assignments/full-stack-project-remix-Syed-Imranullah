const predictionModel = require("../models/predictionModel");

module.exports.listPredictions = async (req, res, next) => {
  try {
    const predictions = await predictionModel.listByUser(req.session.user_id);
    res.send(predictions);
  } catch (err) {
    next(err);
  }
};

module.exports.createPrediction = async (req, res, next) => {
  try {
    const { prediction, fixture_id, league_id } = req.body;
    if (!prediction || !fixture_id || !league_id) return res.status(400).send({ error: "Missing required fields." });
    const newPrediction = await predictionModel.create(
      prediction,
      req.session.user_id,
      fixture_id,
      league_id,
    );
    res.status(201).send(newPrediction);
  } catch (err) {
    next(err);
  }
};

module.exports.updatePrediction = async (req, res, next) => {
  try {
    const { prediction_id } = req.params;
    const existing = await predictionModel.find(prediction_id);
    if (!existing) return res.status(404).send({ error: "Prediction not found."  });
    if (existing.user_id !== req.session.user_id) {
      return res.status(403).send({ error: "Not authorized." });
    }
    const updatedPrediction = await predictionModel.update(prediction_id, req.body);
    res.send(updatedPrediction);
  } catch (err) {
    next(err);
  }
};

module.exports.deletePrediction = async (req, res, next) => {
  try {
    const { prediction_id } = req.params;

    // First find the todo to verify ownership
    const existing = await predictionModel.find(prediction_id);
    if (!existing) return res.status(404).send({ error: "Prediction not found." });
    if (existing.user_id !== req.session.user_id) {
      return res.status(403).send({ error: "Not authorized." });
    }

    // Destroy the todo only after ownership has been verified
    const deletedPrediction = await predictionModel.destroy(prediction_id);
    res.send(deletedPrediction);
  } catch (err) {
    next(err);
  }
};
