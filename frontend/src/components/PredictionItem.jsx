import { updatePrediction, deletePrediction } from "../adapters/prediction-adapters";

function PredictionItem({ prediction, loadPredictions }) {
  // in MatchDay this would update a user's prediction
  // (example: change Win/Draw/Loss or score guess)
  // (expand later for editing predictions)
  const handleUpdate = async () => {
    const { error } = await updatePrediction(prediction.prediction_id, 
  {
  prediction: prediction.prediction,
}
);
    if (error) return console.error(error);
    loadPredictions();
  };
  // in MatchDay this would delete a prediction entry

  const handleDelete = async () => {
    const { error } = await deletePrediction(prediction.prediction_id);
    if (error) return console.error(error);
    loadPredictions();
  };

  // this would delete a job application
  return (
    <li className="prediction-item">
      {/* MatchDay display (temporary structure) */}
      <div>
        <strong>Prediction:</strong> {prediction.prediction}
      </div>

      <div>
        <strong>Fixture ID:</strong> {prediction.fixture_id}
      </div>

      <div>
        <strong>League ID:</strong> {prediction.league_id}
      </div>

      {/* optional future feature: edit prediction */}
      <button onClick={handleUpdate}>Update</button>

      {/* delete prediction */}
      <button className="delete-btn" onClick={handleDelete}>
        Delete
      </button>
    </li>
  );
}


export default PredictionItem;
