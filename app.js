const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('./middleware/rateLimiter');
const apiKeyAuth = require('./middleware/apiKeyAuth');
const errorHandler = require('./middleware/errorMiddleware');

//  Core routes
const authRoutes = require('./routes/authRoutes');
const sportRoutes = require('./routes/sportRoutes');


const app = express();

app.use(helmet());
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));


//  Secure
app.use(apiKeyAuth);

//  Public
app.use('/api/auth', authRoutes);
app.use(rateLimit);


app.use('/api/sports', sportRoutes);



app.use(errorHandler);

module.exports = app;
