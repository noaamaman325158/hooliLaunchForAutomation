import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'; 
import './App.css';  // Import the CSS file

let socket = null;
let socketRemoteServer = null;

function App() {
  let count = 0;
  const [destination, setDestination] = useState(""); 
  const [allDestinations, setAllDestinationsData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);  // Track connection status
  
  useEffect(() => {
    // connect to the socket server
    socket = io("ws://127.0.0.1:2222");

    // socketRemoteServer = io('ws://127.0.0.1:2666');
    
    // Check for connection success
    socket.on('connect', () => {
      setIsConnected(true);  // Set connection status to true (green)
    });
    
    // Check for connection failure
    socket.on('disconnect', () => {
      setIsConnected(false);  // Set connection status to false (red)
    });

    // socketRemoteServer.on('NewTrade', (data) => {
    //   count++;
    //   if (count % 2) {
    //     console.log("File changed in Server ", data);
    //     socket.emit('TradeNow', data);
    //   }
    // });

    socket.on('SendAllData', (AllData) => {
      setAllDestinationsData(AllData.destinations);
      setDestination(AllData.destinations[0]);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
      //socketRemoteServer.disconnect();
    };
  }, [count]);

  const handleAddAccount = async () => {
    setAllDestinationsData([...allDestinations, destination]);
    socket.emit('AddDestination', destination);
  }
  
  const handleDeleteAccount = async (row) => {
    const newArray = allDestinations.filter((item) => item !== row);
    setAllDestinationsData(newArray); 
    socket.emit('DeleteDestination', row);
  }

  return (
    <div className="table-container">
      <div className="connection-status-wrapper">
        {/* Connection status circle */}
        <div 
          className="connection-status" 
          style={{ backgroundColor: isConnected ? 'green' : 'red' }}  // Green if connected, red if not
        />
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
              <td>
                <button onClick={() => handleDeleteAccount(row)}>Delete</button>
              </td>
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
