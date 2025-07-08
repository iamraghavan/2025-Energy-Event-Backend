// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('./middleware/rateLimiter');
const apiKeyAuth = require('./middleware/apiKeyAuth');
const errorHandler = require('./middleware/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');  
const teamRoutes = require('./routes/teamRoutes');
const playerRoutes = require('./routes/playerRoutes');
const sportRoutes = require('./routes/sportRoutes');

const app = express();

app.use(helmet()); // Adds secure HTTP headers
app.use(cors({
  origin: '*', 
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10kb' })); 
app.use(morgan('dev'));


app.use('/api/auth', authRoutes);

app.use(apiKeyAuth);
app.use(rateLimit);

app.use('/api/schools', schoolRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/sports', sportRoutes);

app.use(errorHandler);

module.exports = app;
