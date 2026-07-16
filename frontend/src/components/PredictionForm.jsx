import { useState } from "react";
import { createPrediction } from "../adapters/prediction-adapters";

function PredictionForm({ fixture, activeLeague, onPredicted }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isLocked = new Date(fixture.match_date) < new Date();

  if (!activeLeague) {
    return <p style={{ color: "#94a3b8", marginTop: "0.75rem" }}>Select a league first before predicting.</p>;
  }

  if (isLocked) {
    return <p style={{ color: "#64748b", marginTop: "0.75rem" }}>Predictions are locked — this match has already started.</p>;
  }

  if (submitted) {
    return <p style={{ color: "#4ade80", marginTop: "0.75rem" }}>Prediction submitted! ✓</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setIsSubmitting(true);
    setError(null);
    const { error } = await createPrediction({
      prediction: selected,
      fixture_id: fixture.fixture_id,
      league_id: activeLeague.league_id,
    });
    setIsSubmitting(false);
    if (error) {
      setError(error.message || "Could not submit prediction.");
      return;
    }
    setSubmitted(true);
    if (onPredicted) onPredicted();
  };

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
      {error && <p style={{ color: "#e24b4a", fontSize: "0.82rem", marginTop: "0.5rem" }}>{error}</p>}
      <button className="submit-btn" type="submit" disabled={!selected || isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit Prediction"}
      </button>
    </form>
  );
}

export default PredictionForm;
