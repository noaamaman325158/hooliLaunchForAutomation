import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket = null;
let socketRemoteServer = null;

function App() {
  let count = 0;

  const [destination, setDestination] = useState("");
  const [allDestinations, setAllDestinationsData] = useState([]);
  const [localConnectionStatus, setLocalConnectionStatus] = useState(false);
  const [remoteConnectionStatus, setRemoteConnectionStatus] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // Track overall connection status

  useEffect(() => {
    // Connect to the local socket server
    socket = io("ws://127.0.0.1:2222");
    socket.on('connect', () => {
      setLocalConnectionStatus(true);
      updateConnectionStatus();
    });
    socket.on('disconnect', () => {
      setLocalConnectionStatus(false);
      updateConnectionStatus();
    });

    // Connect to the remote socket server
    socketRemoteServer = io('ws://83.229.81.169:2666');
    socketRemoteServer.on('connect', () => {
      setRemoteConnectionStatus(true);
      updateConnectionStatus();
    });
    socketRemoteServer.on('disconnect', () => {
      setRemoteConnectionStatus(false);
      updateConnectionStatus();
    });

    socketRemoteServer.on('NewTrade', (data) => {
      console.log("NewTrade", data);
      socket.emit('TradeNow', data);
    });

    socket.on('SendAllData', (AllData) => {
      setAllDestinationsData(AllData.destinations);
      setDestination(AllData.destinations[0]);
    });

    // Clean up connections on component unmount
    return () => {
      socket.disconnect();
      socketRemoteServer.disconnect();
    };
  }, []);

  // Update overall connection status
  const updateConnectionStatus = () => {
    setIsConnected(socket.connected && socketRemoteServer.connected);
  };

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
        <h1>Client Interface - put our destinations</h1>

        {/* Connection Status Indicators */}
        <div className="connection-status">
          <span>Local Server: </span>
          <button style={{ backgroundColor: localConnectionStatus ? 'green' : 'red' }} />
          <span>Remote Server: </span>
          <button style={{ backgroundColor: remoteConnectionStatus ? 'green' : 'red' }} />
          <span>Overall Connection Status: </span>
          <button style={{ backgroundColor: isConnected ? 'green' : 'red' }} />
        </div>

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
