const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok)
      throw new Error(`Fetch failed. ${response.status} ${response.statusText}`);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchAllPredictions = async (league_id) => {
  const url = league_id
    ? `/api/predictions?league_id=${league_id}`
    : "/api/predictions";
  return handleFetch(url);
};

export const createPrediction = async ({ prediction, fixture_id, league_id }) => {
  return handleFetch("/api/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prediction, fixture_id, league_id }),
  });
};

export const updatePrediction = async (prediction_id, updates) => {
  return handleFetch(`/api/predictions/${prediction_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
};

export const deletePrediction = async (prediction_id) => {
  return handleFetch(`/api/predictions/${prediction_id}`, { method: "DELETE" });
};
