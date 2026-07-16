import PredictionItem from "./PredictionItem";

function PredictionList({ predictions, loadPredictions }) {
  if (!predictions || !predictions.length) return null;

  return (
    <ul id="prediction-list">
      {predictions.map((prediction) => (
        <PredictionItem
          key={prediction.prediction_id}
          prediction={prediction}
          loadPredictions={loadPredictions}
        />
      ))}
    </ul>
  );
}

export default PredictionList;
