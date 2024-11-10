// server.js

import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the IoT Traffic Monitoring Backend!');
});

// Local prediction function to simulate traffic data predictions
const localPredictionEngine = (data) => {
  // Simulate some kind of prediction logic
  return {
    prediction: 'Heavy traffic expected',
    confidence: Math.random() * 100,
  };
};

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Listen for traffic data from IoT devices
  socket.on('trafficData', async (data) => {
    console.log('Received traffic data:', data);

    try {
      // Process data locally instead of sending it to AWS Lambda
      const predictions = localPredictionEngine(data);

      // Combine traffic data and predictions
      const combinedData = { ...data, predictions };

      // Emit combined data to all connected clients
      io.emit('processedTrafficData', combinedData);
    } catch (err) {
      console.error('Error processing traffic data:', err.message);
      // Optionally, emit error to clients
      io.emit('error', { message: 'Error processing traffic data' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
