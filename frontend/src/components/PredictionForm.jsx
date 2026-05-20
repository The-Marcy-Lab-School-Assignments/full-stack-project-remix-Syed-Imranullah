import { useState } from "react";
import { createPrediction } from "../adapters/prediction-adapters";

function PredictionForm({ fixture, activeLeague, loadPredictions }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!activeLeague) {
    return <p style={{ color: "#94a3b8", marginTop: "0.75rem" }}>Select a league first before predicting.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    const { error } = await createPrediction({
      prediction: selected,
      fixture_id: fixture.fixture_id,
      league_id: activeLeague.league_id,
    });
    if (error) return console.error(error);
    setSubmitted(true);
    await loadPredictions();
  };

  if (submitted) {
    return <p style={{ color: "#4ade80", marginTop: "0.75rem" }}>Prediction submitted!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="outcome-btns">
        <button
          type="button"
          className={`outcome-btn ${selected === "home" ? "selected" : ""}`}
          onClick={() => setSelected("home")}
        >
          {fixture.home_team} Win
        </button>
        <button
          type="button"
          className={`outcome-btn ${selected === "draw" ? "selected" : ""}`}
          onClick={() => setSelected("draw")}
        >
          Draw
        </button>
        <button
          type="button"
          className={`outcome-btn ${selected === "away" ? "selected" : ""}`}
          onClick={() => setSelected("away")}
        >
          {fixture.away_team} Win
        </button>
      </div>
      <button className="submit-btn" type="submit">
        Submit Prediction
      </button>
    </form>
  );
}

export default PredictionForm;