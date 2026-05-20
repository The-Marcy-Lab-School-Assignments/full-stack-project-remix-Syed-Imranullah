const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({ error: 'Username and password are required.' });
    }

    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).send({ error: 'Username already taken.' });
    }

    const user = await userModel.create(username, password);
    req.session.user_id = user.user_id;
    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.validatePassword(username, password);
    if (!user) return res.status(401).send({ error: 'Invalid credentials.' });
    req.session.user_id = user.user_id;
    res.send(user);
  } catch (err) {
    next(err);
  }
};

// Returns the logged-in user object, or null if no session exists.
// Returning JSON null (200) keeps the response format consistent — the frontend
// can always call response.json() without hitting a parse error.
module.exports.getMe = async (req, res, next) => {
  try {
    if (!req.session.user_id) return res.json(null);
    const user = await userModel.find(req.session.user_id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports.logout = (req, res) => {
  req.session = null;
  res.send({ message: 'Logged out.' });
};
module.exports.updateUsername = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).send({ error: "Username required." });
    const existing = await userModel.findByUsername(username);
    if (existing) return res.status(400).send({ error: "Username already taken." });
    const user = await userModel.updateUsername(req.session.user_id, username);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).send({ error: "Both fields required." });
    }
    const user = await userModel.validatePassword(
      (await userModel.find(req.session.user_id)).username,
      currentPassword
    );
    if (!user) return res.status(401).send({ error: "Current password incorrect." });
    const newHash = await bcrypt.hash(newPassword, 8);
    await userModel.updatePassword(req.session.user_id, newHash);
    res.send({ message: "Password updated." });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteAccount = async (req, res, next) => {
  try {
    await userModel.destroy(req.session.user_id);
    req.session = null;
    res.send({ message: "Account deleted." });
  } catch (err) {
    next(err);
  }
};