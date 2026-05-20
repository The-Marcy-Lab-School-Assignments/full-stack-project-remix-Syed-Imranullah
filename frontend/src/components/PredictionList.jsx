import PredictionItem from "./PredictionItem";

// in MatchDay this becomes PredictionList
// it renders all predictions or fixtures for the user
function PredictionList({ predictions, loadPredictions }) {
  if (!predictions || !predictions.length) {
    return <p>No predictions yet. Head to Fixtures to make your first one.</p>;
  }
  return (
    <ul id="prediction-list">
      {predictions.map((prediction) => (
        <PredictionItem
          key={prediction.prediction_id}
          // in MatchDay this data would represent:
          // fixture info + user prediction + points earned
          prediction={prediction}
          // reloads updated prediction data after mutations
          loadPredictions={loadPredictions}
        />
      ))}
    </ul>
  );
}

export default PredictionList;
