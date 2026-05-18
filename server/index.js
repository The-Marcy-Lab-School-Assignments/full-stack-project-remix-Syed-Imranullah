const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
require('dotenv').config();

const logRoutes = require('./middleware/logRoutes');
const checkAuthentication = require('./middleware/checkAuthentication');
const authControllers = require('./controllers/authControllers');
const predictionControllers = require('./controllers/predictionControllers');
const fixtureControllers = require("./controllers/fixtureControllers");

const app = express();
const PORT = process.env.PORT || 8080;

// ====================================
// Middleware
// ====================================

app.use(logRoutes);
app.use(cookieSession({ name: 'session', secret: process.env.SESSION_SECRET }));
app.use(express.json());

// In production, serve the built React app from frontend/dist.
// In development, Vite's dev server handles the frontend on a separate port
// and proxies /api requests to this server.
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ====================================
// Auth routes
// ====================================

app.post('/api/auth/register', authControllers.register);
app.post('/api/auth/login', authControllers.login);
app.get('/api/auth/me', authControllers.getMe);
app.delete('/api/auth/logout', authControllers.logout);

// ====================================
// Todo routes (all require authentication)
// ====================================

app.get('/api/predictions', checkAuthentication, predictionControllers.listPredictions);
app.post('/api/predictions', checkAuthentication, predictionControllers.createPrediction);
app.patch('/api/predictions/:prediction_id', checkAuthentication, predictionControllers.updatePrediction);
app.delete('/api/predictions/:prediction_id', checkAuthentication, predictionControllers.deletePrediction);
app.get("/api/fixtures", fixtureControllers.listFixtures);
app.get("/api/fixtures/:fixture_id", fixtureControllers.getFixture);

// ====================================
// Global Error Handler
// ====================================

const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
};
app.use(handleError);

// ====================================
// Listen
// ====================================

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
