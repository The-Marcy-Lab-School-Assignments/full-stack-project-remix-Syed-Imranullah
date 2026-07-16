import { useState } from "react";

function AuthPage({ handleLogin, handleRegister }) {
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const switchTab = (newTab) => {
    setTab(newTab);
    setErrorMessage(null);
    setUsername("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (tab === "login") {
      const error = await handleLogin(username, password);
      if (error) setErrorMessage("Invalid username or password.");
    } else {
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters.");
        setIsLoading(false);
        return;
      }
      const error = await handleRegister(username, password);
      if (error) setErrorMessage(error.message || "Could not register. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-logo">GOALIQ ⚽</div>
          <p className="auth-tagline">Predict. Compete. Win.</p>
        </div>

        <div className="auth-panel">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => switchTab("login")}
            >
              Log In
            </button>
            <button
              className={`auth-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => switchTab("register")}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={tab === "login" ? "current-password" : "new-password"}
            />
            {tab === "register" && (
              <p className="auth-hint">Password must be at least 6 characters.</p>
            )}
            {errorMessage && <p className="auth-error">{errorMessage}</p>}
            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? "Please wait…" : tab === "login" ? "Log In" : "Create Account"}
            </button>
          </form>
        </div>

        <div className="how-it-works">
          <p className="how-title">How GOALIQ Works</p>
          <div className="how-steps">
            <div className="how-step">
              <span className="how-icon">⚽</span>
              <div>
                <strong>Predict Matches</strong>
                <p>Pick home win, draw, or away win before kick-off</p>
              </div>
            </div>
            <div className="how-step">
              <span className="how-icon">🏆</span>
              <div>
                <strong>Join a League</strong>
                <p>Create or join a private league to compete with friends</p>
              </div>
            </div>
            <div className="how-step">
              <span className="how-icon">🎯</span>
              <div>
                <strong>Earn Points</strong>
                <p>Score 3 points for every correct prediction. Climb the leaderboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
