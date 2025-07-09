const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('./middleware/rateLimiter');
const apiKeyAuth = require('./middleware/apiKeyAuth');
const errorHandler = require('./middleware/errorMiddleware');

//  Core routes
const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const teamRoutes = require('./routes/teamRoutes');
const playerRoutes = require('./routes/playerRoutes');
const sportRoutes = require('./routes/sportRoutes');

//  NEW: Add your sports match routes here
const kabaddiRoutes = require('./routes/kabaddiRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

//  Public
app.use('/api/auth', authRoutes);

//  Secure
app.use(apiKeyAuth);
app.use(rateLimit);

app.use('/api/schools', schoolRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/sports', sportRoutes);

//  Sports Match modules
app.use('/api/kabaddi', kabaddiRoutes);


app.use(errorHandler);

module.exports = app;
