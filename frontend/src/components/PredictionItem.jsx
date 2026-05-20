import {
  updatePrediction,
  deletePrediction,
} from "../adapters/prediction-adapters";

function PredictionItem({ prediction, loadPredictions }) {
  // in MatchDay this would update a user's prediction
  // (example: change Win/Draw/Loss or score guess)
  // (expand later for editing predictions)
  const handleUpdate = async () => {
    const { error } = await updatePrediction(prediction.prediction_id, {
      prediction: prediction.prediction,
    });
    if (error) return console.error(error);
    loadPredictions();
  };
  // in MatchDay this would delete a prediction entry

  const handleDelete = async () => {
    const { error } = await deletePrediction(prediction.prediction_id);
    if (error) return console.error(error);
    loadPredictions();
  };

  const isLocked = new Date(prediction.match_date) < new Date();

  // this would delete a job application
  return (
    <li className="prediction-item">
      {/* MatchDay display (temporary structure) */}
      <div className="match-label">
        <strong>
          {prediction.home_team} VS {prediction.away_team}
        </strong>
      </div>
      {/* user prediction */}
      <div className="pick-label">
        <strong>Your Pick:</strong> <span>{prediction.prediction}</span>
      </div>
      {/* points */}
      <div className="points-badge">
        Points: {prediction.points ?? 0}
      </div>
      {/* status */}
      <div>
        <strong>Status:</strong> {isLocked ? "Locked" : "Open"}
      </div>

      {/* optional future feature: edit prediction */}
      {!isLocked && (
        <button className="delete-btn" onClick={handleDelete}>
          Delete
        </button>
      )}
    </li>
  );
}

export default PredictionItem;
