import { useState, useEffect } from "react";
import { getMe, login, register, logout } from "./adapters/auth-adapters";
import AuthPage from "./components/AuthPage";
import ApplicationPage from "./components/ApplicationPage";
import FixturesPage from "./components/FixturesPage";
import LeaguePage from "./components/LeaguePage";
import Leaderboard from "./components/Leaderboard";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // On every page load, check the server for an active session cookie.
  // React state doesn't survive a refresh; session cookies do.
  useEffect(() => {
    const checkForSession = async () => {
      const { data: user } = await getMe();
      setCurrentUser(user);
    };
    checkForSession();
  }, []);

  // Handlers that manage updating the current user.
  // Defined in App to ensure that child components only
  // update the current user in a controlled manner.
  const handleLogin = async (username, password) => {
    const { data: user, error } = await login(username, password);
    if (error) return error;
    setCurrentUser(user);
  };

  const handleRegister = async (username, password) => {
    const { data: user, error } = await register(username, password);
    if (error) return error;
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
  };

  // SIMPLE NAV STATE (temporary router)
  const [page, setPage] = useState("fixtures");
  const [activeLeague, setActiveLeague] = useState(() => {
    const saved = localStorage.getItem("activeLeague");
    return saved ? JSON.parse(saved) : null;
  });
  if (!currentUser) {
    return (
      <AuthPage handleLogin={handleLogin} handleRegister={handleRegister} />
    );
  }
  const handleSetActiveLeague = (league) => {
    setActiveLeague(league);
    localStorage.setItem("activeLeague", JSON.stringify(league));
   
  };
   const handleDeactivateLeague = () => {
      setActiveLeague(null);
      localStorage.removeItem("activeLeague");
    };
  return (
    <main className="app">
      {/* HEADER */}
 <div className="app-header">
  {/* LEFT */}
  <h1>GOALIQ ⚽</h1>

  {/* CENTER */}
  <div className="header-center">
    👤 {currentUser.username}
  </div>

  {/* RIGHT */}
  <div className="header-right">
    {activeLeague && (
      <div className="league-dropdown">
  <button className="active-league-btn">
    ⚽ {activeLeague.league_name}
  </button>

  <div className="league-dropdown-menu">
    <button onClick={handleDeactivateLeague}>
      Deactivate
    </button>
  </div>
</div>
    )}

    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  </div>
</div>

      {/* NAV */}
      <nav>
        <button onClick={() => setPage("fixtures")}>Fixtures</button>
        <button onClick={() => setPage("leagues")}>Leagues</button>
        <button onClick={() => setPage("leaderboard")}>Leaderboard</button>
        <button onClick={() => setPage("predictions")}>My Predictions</button>
      </nav>

      {/* PAGES */}
      {page === "fixtures" && (
        <FixturesPage
          currentUser={currentUser}
          handleLogout={handleLogout}
          activeLeague={activeLeague}
        />
      )}

      {page === "leagues" && (
        <LeaguePage
          currentUser={currentUser}
          handleLogout={handleLogout}
          setActiveLeague={handleSetActiveLeague}
          activeLeague={activeLeague}
            handleDeactivateLeague={handleDeactivateLeague}

        />
      )}

      {page === "predictions" && (
        <ApplicationPage
          currentUser={currentUser}
          handleLogout={handleLogout}
          activeLeague={activeLeague}
        />
      )}
      {page === "leaderboard" && <Leaderboard activeLeague={activeLeague} />}
    </main>
  );
}

export default App;
