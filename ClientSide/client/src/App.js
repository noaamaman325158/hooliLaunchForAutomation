// Import necessary modules
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

let socket;

function App() {
  const [destination, setDestination] = useState("");
  const [allDestinations, setAllDestinationsData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);  // Track connection status

  useEffect(() => {
    // Connect to the backend WebSocket server
    socket = io("ws://127.0.0.1:2222");

    socket.on('connect', () => setIsConnected(true));  // Show connected
    socket.on('disconnect', () => setIsConnected(false)); // Show disconnected

    // Listen for data from backend
    socket.on('SendAllData', (AllData) => {
      setAllDestinationsData(AllData.destinations);
      setDestination(AllData.destinations[0]);
    });

    // Cleanup on component unmount
    return () => socket.disconnect();
  }, []);

  const handleAddAccount = () => {
    setAllDestinationsData([...allDestinations, destination]);
    socket.emit('AddDestination', destination);
  }

  const handleDeleteAccount = (row) => {
    const newArray = allDestinations.filter((item) => item !== row);
    setAllDestinationsData(newArray);
    socket.emit('DeleteDestination', row);
  }

  return (
      <div className="table-container">
        <div className="connection-status-wrapper">
          {/* Connection status */}
          <div className="connection-status" style={{ backgroundColor: isConnected ? 'green' : 'red' }} />
          <span className="connection-text">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
        </div>
        <h1>Client Interface - put our destinations</h1>

        <table className="table">
          <thead>
          <tr>
            <th>Account</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {allDestinations.map(row => (
              <tr key={row}>
                <td>{row}</td>
                <td><button onClick={() => handleDeleteAccount(row)}>Delete</button></td>
              </tr>
          ))}
          </tbody>
        </table>

        <div>
          <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination name"
          />
          <button onClick={handleAddAccount}>Add Account</button>
        </div>
      </div>
  );
}

export default App;
