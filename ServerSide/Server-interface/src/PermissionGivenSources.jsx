import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client'; 

const DataTable = () => {
  const serverIP = "127.0.0.1";
  const serverPort = 3001;
  const [source, setSource] = useState("Sim101"); 
  const socketRef = useRef(null); // Ensure single socket instance

  useEffect(() => {
    // Ensure socket is only initialized once
    if (!socketRef.current) {
      console.log('Attempting to connect socket...');
      
      socketRef.current = io(`ws://${serverIP}:${serverPort}`, {
        reconnectionAttempts: 10,  // Number of reconnection attempts
        reconnectionDelay: 5000,   // 5 seconds between reconnections
        timeout: 20000             // 20 seconds timeout to connect
      });

      // Listen for the initial data from the server
      socketRef.current.on('SendAllData', (AllData) => {
        setSource(AllData.source);
        console.log('Received data from server:', AllData);
      });

      // Handle connection errors
      socketRef.current.on('error', (err) => {
        console.error('Socket error:', err);
      });

      // Listen for successful connections
      socketRef.current.on('connect', () => {
        console.log('Frontend successfully connected to server');
      });

      // Listen for disconnections
      socketRef.current.on('disconnect', () => {
        console.log('Frontend disconnected from server');
      });
    }

    return () => {
      // Clean up the socket connection on component unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        console.log('Socket disconnected on component unmount');
      }
    };
  }, []);

  // Function to update the source and emit event to the server
  const handleUpdateSource = () => {
    if (socketRef.current) {
      console.log(`Updating source to: ${source}`);
      socketRef.current.emit('UpdateSource', source);
    }
  };

  return (
    <div className="table-container">
      <h1>Server Interface - Update Source</h1>
      <div className="source-container">
        <label>Source: </label>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="source-input"
        />
        <button onClick={handleUpdateSource}>Update Source</button>
      </div>
    </div>
  );
};

export default DataTable;

