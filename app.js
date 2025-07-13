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
const schoolRoutes = require('./routes/schoolRoutes');

const teamRoutes = require('./routes/teamRoutes');



const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');


const app = express();

app.use(helmet());
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//  Secure
app.use(apiKeyAuth);

//  Public
app.use('/api/auth', authRoutes);
app.use(rateLimit);


app.use('/api/sports', sportRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/teams', teamRoutes);

app.use(errorHandler);

module.exports = app;
