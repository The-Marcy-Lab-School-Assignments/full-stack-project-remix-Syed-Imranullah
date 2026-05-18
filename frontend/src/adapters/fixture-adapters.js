const handleFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// GET all fixtures
export const fetchFixtures = async () => {
  return handleFetch("/api/fixtures");
};

// GET single fixture
export const fetchFixture = async (fixture_id) => {
  return handleFetch(`/api/fixtures/${fixture_id}`);
};