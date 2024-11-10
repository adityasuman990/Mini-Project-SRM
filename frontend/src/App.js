// App.js

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  // const [coinId, setCoinId] = useState('bitcoin'); // For future extensions

  useEffect(() => {
    // Initialize Socket.io connection
    const socket = io('http://localhost:1000'); // Update if backend is hosted elsewhere

    // Listen for processed traffic data
    socket.on('processedTrafficData', (incomingData) => {
      // Destructure incoming data
      const { vehicle_count } = incomingData;

      // Initialize an object to hold predictions
      let predictions = null;

      // Implementing if-else logic based on vehicle_count
      if (vehicle_count > 100) {
        // Severe Congestion
        predictions = {
          predicted_congestion: 'Severe Congestion',
          avg_speed_prediction: Math.max(0, Math.floor(incomingData.avg_speed * 0.5)), // 50% reduction
        };
      } else if (vehicle_count > 50) {
        // High Congestion
        predictions = {
          predicted_congestion: 'High Congestion',
          avg_speed_prediction: Math.max(0, Math.floor(incomingData.avg_speed * 0.6)), // 40% reduction
        };
      } else if (vehicle_count > 20) {
        // Moderate Congestion
        predictions = {
          predicted_congestion: 'Moderate Congestion',
          avg_speed_prediction: Math.max(0, Math.floor(incomingData.avg_speed * 0.8)), // 20% reduction
        };
      } else {
        // Low Congestion
        predictions = {
          predicted_congestion: 'Low Congestion',
          avg_speed_prediction: incomingData.avg_speed, // No reduction
        };
      }

      // Combine incoming data with predictions
      const combinedData = { ...incomingData, predictions };

      setData(combinedData);
    });

    // Listen for errors
    socket.on('error', (errorData) => {
      setError(errorData.message);
    });

    // Handle socket disconnect
    socket.on('disconnect', () => {
      console.log('Disconnected from backend server');
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleFetchData = () => {
    // No action needed; data is received in real-time
    // Optionally, you can implement logic to request initial data
    console.log('Data is being received in real-time from IoT devices');
  };

  return (
    <div className="App">
      <h1>Real-time Traffic Monitoring - Delhi</h1>
      <button onClick={handleFetchData}>Fetch Data</button>

      {error && <p className="error">{error}</p>}

      {data && (
        <div className="data-container">
          <h2>Current Traffic Data</h2>
          <p>
            <strong>Timestamp:</strong>{' '}
            {new Date(data.timestamp).toLocaleString()}
          </p>
          <p>
            <strong>Location:</strong> {data.location}
          </p>
          <p>
            <strong>Vehicle Count:</strong> {data.vehicle_count}
          </p>
          <p>
            <strong>Average Speed:</strong> {data.avg_speed} km/h
          </p>
          <p>
            <strong>Congestion Level:</strong> {data.congestion_level}
          </p>

          {data.predictions && (
            <>
              <h2>Traffic Predictions</h2>
              <p>
                <strong>Predicted Congestion:</strong>{' '}
                {data.predictions.predicted_congestion}
              </p>
              <p>
                <strong>Average Speed Prediction:</strong>{' '}
                {data.predictions.avg_speed_prediction} km/h
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
