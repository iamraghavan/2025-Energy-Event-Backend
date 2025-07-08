// server.js
require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
