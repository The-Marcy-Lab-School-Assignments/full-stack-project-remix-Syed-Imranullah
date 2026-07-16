import { useState } from "react";
import {
  updateUsername,
  updatePassword,
  deleteAccount,
} from "../adapters/auth-adapters";

function SettingsPage({ currentUser, setCurrentUser, handleLogout }) {
  const [tab, setTab] = useState("username");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const reset = () => {
    setSuccess(null);
    setError(null);
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    reset();
    const { data, error } = await updateUsername(newUsername);
    if (error) return setError("Username already taken or invalid.");
    setCurrentUser(data);
    setSuccess("Username updated successfully.");
    setNewUsername("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    reset();
    if (newPassword !== confirmPassword) {
      return setError("New passwords don't match.");
    }
    if (newPassword.length < 6) {
      return setError("New password must be at least 6 characters.");
    }
    const { error } = await updatePassword(currentPassword, newPassword);
    if (error) return setError("Current password is incorrect.");
    setSuccess("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure? This will permanently delete your account, all your predictions, and remove you from all leagues.",
    );
    if (!confirmed) return;
    await deleteAccount();
    handleLogout();
  };

  return (
    <section>
      <p className="page-title">Settings</p>

      <div className="settings-tabs">
        <button
          className={`settings-tab ${tab === "username" ? "active" : ""}`}
          onClick={() => {
            setTab("username");
            reset();
          }}
        >
          Change Username
        </button>
        <button
          className={`settings-tab ${tab === "password" ? "active" : ""}`}
          onClick={() => {
            setTab("password");
            reset();
          }}
        >
          Change Password
        </button>
        <button
          className={`settings-tab ${tab === "danger" ? "active" : ""}`}
          onClick={() => {
            setTab("danger");
            reset();
          }}
        >
          Delete Account
        </button>
      </div>

      {success && <p className="settings-success">{success}</p>}
      {error && <p className="error">{error}</p>}

      {tab === "username" && (
        <div className="form-card">
          <p className="section-title">
            Current username: {currentUser.username}
          </p>
          <form onSubmit={handleUsernameSubmit}>
            <input
              placeholder="New username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <button className="create-btn" type="submit">
              Update Username
            </button>
          </form>
        </div>
      )}

      {tab === "password" && (
        <div className="form-card">
          <p className="section-title">Update your password</p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="create-btn" type="submit">
              Update Password
            </button>
          </form>
        </div>
      )}

      {tab === "danger" && (
        <div className="form-card" style={{ borderColor: "#7f1d1d" }}>
          <p className="section-title" style={{ color: "#e24b4a" }}>
            Danger Zone
          </p>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.9rem",
              marginBottom: "1rem",
            }}
          >
            Deleting your account is permanent. All your predictions and league
            memberships will be removed immediately.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button
              onClick={handleDeleteAccount}
              style={{
                flex: 1,
                background: "transparent",
                border: "1px solid #e24b4a",
                color: "#e24b4a",
                padding: "0.65rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
                transition: "0.2s ease",
              }}
            >
              Delete My Account
            </button>

            
          </div>
        </div>
      )}
     <div
  style={{
    display: "flex",
    justifyContent: "center",
    margin: "1.5rem 0",
  }}
>
  <button
    onClick={handleLogout}
    style={{
      background: "#475569",
      color: "white",
      padding: "0.50rem 1rem",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: "1rem",
      boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
      transition: "0.2s ease",
    }}
    onMouseOver={(e) => {
      e.target.style.background = "#334155";
      e.target.style.transform = "scale(1.03)";
    }}
    onMouseOut={(e) => {
      e.target.style.background = "#475569";
      e.target.style.transform = "scale(1)";
    }}
  >
    Log Out
  </button>
</div>
    </section>
  );
}

export default SettingsPage;
