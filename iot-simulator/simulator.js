// simulator.js

import { io } from 'socket.io-client';
import dotenv from 'dotenv';

dotenv.config();

const SOCKET_SERVER_URL = process.env.SOCKET_SERVER_URL || 'http://localhost:1000';

const socket = io(SOCKET_SERVER_URL);

socket.on('connect', () => {
  console.log('Connected to backend server');

  // Emit traffic data every 5 seconds
  setInterval(() => {
    const trafficData = generateTrafficData();
    socket.emit('trafficData', trafficData);
    console.log('Sent traffic data:', trafficData);
  }, 5000);
});

socket.on('disconnect', () => {
  console.log('Disconnected from backend server');
});

// Function to generate random traffic data
function generateTrafficData() {
  const locations = [
    'Connaught Place',
    'Chandni Chowk',
    'India Gate',
    'MG Road',
    'Dwarka Sector 21',
    'Khan Market',
    'Lajpat Nagar',
    'Karol Bagh',
    'Noida Sector 18',
    'Saket'
  ];
  const congestionLevels = ['Low', 'Moderate', 'High'];
  const speeds = [20, 40, 60]; // Average speeds in km/h for city traffic

  return {
    timestamp: new Date(),
    location: locations[Math.floor(Math.random() * locations.length)],
    vehicle_count: Math.floor(Math.random() * 100), // Random vehicle count
    avg_speed: speeds[Math.floor(Math.random() * speeds.length)], // Average speed
    congestion_level: congestionLevels[Math.floor(Math.random() * congestionLevels.length)],
  };
}
