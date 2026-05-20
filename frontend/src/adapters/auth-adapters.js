const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Fetch failed. ${response.status} ${response.statusText}`);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getMe = async () => {
  return handleFetch('/api/auth/me');
};

export const register = async (username, password) => {
  return handleFetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
};

export const login = async (username, password) => {
  return handleFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
};

export const logout = async () => {
  return handleFetch('/api/auth/logout', { method: 'DELETE' });
};

export const updateUsername = async (username) => {
  return handleFetch('/api/auth/username', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
};

export const updatePassword = async (currentPassword, newPassword) => {
  return handleFetch('/api/auth/password', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

export const deleteAccount = async () => {
  return handleFetch('/api/auth/account', { method: 'DELETE' });
};