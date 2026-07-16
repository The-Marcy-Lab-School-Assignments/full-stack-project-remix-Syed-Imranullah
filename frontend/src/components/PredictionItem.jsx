import { deletePrediction } from "../adapters/prediction-adapters";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

function PredictionItem({ prediction, loadPredictions }) {
  const isLocked = new Date(prediction.match_date) < new Date();
  const resultStatus = !isLocked
    ? "pending"
    : prediction.points === 3
    ? "correct"
    : "wrong";

  const pickLabel =
    {
      home: `${prediction.home_team} Win`,
      away: `${prediction.away_team} Win`,
      draw: "Draw",
    }[prediction.prediction] || prediction.prediction;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete your prediction for ${prediction.home_team} vs ${prediction.away_team}?`
    );
    if (!confirmed) return;
    const { error } = await deletePrediction(prediction.prediction_id);
    if (error) return console.error(error);
    loadPredictions();
  };

  return (
    <li className={`prediction-item prediction-${resultStatus}`}>
      <div className="pi-header">
        <span className="pi-teams">
          {prediction.home_team} <span className="pi-vs">vs</span> {prediction.away_team}
        </span>
        <span className="pi-date">{formatDate(prediction.match_date)}</span>
      </div>

      <div className="pi-pick">
        Your pick: <strong>{pickLabel}</strong>
      </div>

      <div className="pi-footer">
        <span className={`pi-status pi-status-${resultStatus}`}>
          {resultStatus === "correct"
            ? "✓ Correct"
            : resultStatus === "wrong"
            ? "✗ Wrong"
            : "⏳ Pending"}
        </span>
        <span className="points-badge">{prediction.points ?? 0} pts</span>
        {!isLocked && (
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </li>
  );
}

export default PredictionItem;
