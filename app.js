const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const rateLimit = require('./middleware/rateLimiter');
const apiKeyAuth = require('./middleware/apiKeyAuth');
const errorHandler = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const sportRoutes = require('./routes/sportRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const matchRoutes = require('./routes/matchRoutes');
const teamRoutes = require('./routes/teamRoutes');
const playerRoutes = require('./routes/playerRoutes');
const layoutRoutes = require('./routes/layoutRoutes');
const cricketMatchRoutes = require('./routes/cricketMatchRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// 🩺 Health check for keep-alive pings
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// 🔒 Secure: check API key before protected endpoints
app.use(apiKeyAuth);

// Public routes
app.use('/api/auth', authRoutes);
app.use(rateLimit);

// API endpoints
app.use('/api/sports', sportRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/layout', layoutRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/cricket-matches', cricketMatchRoutes);



app.use(errorHandler);

module.exports = app;
