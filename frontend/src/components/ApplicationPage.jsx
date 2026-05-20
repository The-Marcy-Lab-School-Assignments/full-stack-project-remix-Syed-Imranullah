import { useState, useEffect } from "react";
import { fetchAllPredictions } from "../adapters/prediction-adapters";
import PredictionForm from "./PredictionForm";
import PredictionList from "./PredictionList";

function ApplicationPage({ currentUser, handleLogout, activeLeague }) {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This helper fetches todos on page load with useEffect
  // It is also used within the AddTodoForm and TodoList
  // to re-fetch the todos when a mutation action is performed
  // such as creating, deleting, or updating a todo.

  // main data fetching function
  // in MatchDay this would be "loadFixtures / loadPredictions / loadApplications"
  // depending on what page is being built
  const loadPredictions = async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await fetchAllPredictions();

    if (fetchError) setError(fetchError.message);
    else setPredictions(data);
    setIsLoading(false);
  };
  // runs once when page loads
  // in MatchDay this also helps "session rehydration style behavior"

  useEffect(() => {
    loadPredictions();
  }, []);
  if (!activeLeague) {
    return <p>Select a league first to view your predictions.</p>;
  }

  return (
    <section>
      <h2 className="page-title">
        My Predictions — {activeLeague.league_name}
      </h2>
      {isLoading && <p>Loading predictions...</p>}
      {error && <p className="error">Something went wrong: {error}</p>}
      {!isLoading && !predictions.length && (
        <p>No predictions yet. Head to Fixtures to make your first one.</p>
      )}
      <PredictionList
        predictions={predictions}
        loadPredictions={loadPredictions}
      />
    </section>
  );
}

export default ApplicationPage;
