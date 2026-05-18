import { useEffect, useState } from "react";
import { createPrediction } from "../adapters/prediction-adapters";
import { fetchFixtures } from "../adapters/fixture-adapters";

// in MatchDay this becomes AddPredictionForm
// users now pick REAL fixtures instead of typing IDs
function PredictionForm({ loadPredictions }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    // instead of "title"
    // MatchDay would use fields like:
    // fixture_id
    // prediction (Home Win / Draw / Away Win)
    const fixture_id = form.elements.fixture_id.value;
    const prediction = form.elements.prediction.value;
    const league_id = form.elements.league_id.value;
    if (!fixture_id || !prediction || !league_id) return;

const { error } = await createPrediction(
  prediction,
  fixture_id,
  league_id
);    if (error) return console.error(error);
    // reloads predictions after submitting

    await loadPredictions();
    form.reset();
  };

  return (
    <form id="prediction-form" onSubmit={handleSubmit}>
      <h3>Make Prediction</h3>
      {/* in MatchDay this form would probably include:
          dropdown for fixture
          prediction buttons
          optional score prediction */}
      <input type="text" name="fixture_id" placeholder="Fixture ID" />
      {/* prediction input */}
      <select name="prediction">
        <option value="home">Home Win</option>
        <option value="draw">Draw</option>
        <option value="away">Away Win</option>
      </select>

      {/* league input (temporary until you build leagues UI) */}
      <input type="text" name="league_id" placeholder="League ID" />
      <button type="submit">Submit Prediction</button>
    </form>
  );
}

export default PredictionForm;
