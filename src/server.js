require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
🚀 JobBoard API Server running
   Port:        ${PORT}
   Environment: ${process.env.NODE_ENV || 'development'}
   Docs:        http://localhost:${PORT}/health
    `);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
