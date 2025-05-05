import express from 'express';
import dotenv from 'dotenv';
import mongo from './services/db.js';
import historyRouter from './routes/history.js';  // Renamed for clarity
import monstersRouter from './routes/monsters.js';  // Import monsters route

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Use JSON middleware to parse request bodies
app.use(express.json());

// Connect to MongoDB
mongo.connect().then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
  process.exit(1);  // Exit the process if connection fails
});

// Use the history route (POST data to /history)
app.use('/history', historyRouter);  // Use the imported router for history

// Use the monsters route (GET data from /monsters)
app.use('/monsters', monstersRouter);  // Use the imported router for monsters

// Define a simple root route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Generic error handler (optional but useful)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Set the port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown (optional)
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongo.close();  // Close MongoDB connection before exiting
  server.close(() => {
    console.log('Server shut down gracefully');
    process.exit(0);
  });
});