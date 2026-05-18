const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok)
      throw new Error(
        `Fetch failed. ${response.status} ${response.statusText}`,
      );
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// gets all todos (now: job applications for logged-in user)
// in MatchDay this would become:
// fetch all predictions OR fixtures for the logged-in user

export const fetchAllPredictions = async () => {
  return handleFetch("/api/predictions");
};

// in MatchDay this becomes submitting a match prediction
// example payload:
// { fixture_id, prediction: "Arsenal Win" }
export const createPrediction = async ({prediction,
  fixture_id,
  league_id,}) => {
  return handleFetch("/api/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
      // in MatchDay this would NOT just be "title"
    // it would include:
    // - fixture_id
    // - prediction (W/D/L or score guess)
    body: JSON.stringify({
      prediction,
      fixture_id,
      league_id,
    }),
  });
};

// updates a todo (now: update application status / notes)
// in MatchDay this would update a prediction
// (example: change prediction OR update points after scoring)
export const updatePrediction = async (prediction_id, updates) => {
  return handleFetch(`/api/predictions/${prediction_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
};

// deletes a todo (now: delete a job application)
// in MatchDay this deletes a prediction entry
export const deletePrediction = async (prediction_id) => {
  return handleFetch(`/api/predictions/${prediction_id}`, { method: "DELETE" });
};
