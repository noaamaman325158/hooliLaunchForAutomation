<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './mainClientInterface.css';

function ClientInterface() {
  const [connected, setConnected] = useState(false);
  const [tableData, setTableData] = useState([]); 
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [clientCount, setClientCount] = useState(0); 

  useEffect(() => {
    const fetchAllowedDestinationsToTracking = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getDestinationsAllowTracking');
        const destinationsAllowed = response.data;
        console.log('Fetched data:', destinationsAllowed);
        setTableData(destinationsAllowed.map((destination, index) => ({
          id: index,
          name: destination  
        })));
      } catch (error) {
        console.error('Failed to fetch destinations:', error.response ? error.response.data : error.message);
      }
    };

    fetchAllowedDestinationsToTracking();
    fetchClientCount(); // Fetch initial client count on mount
  }, []); 

  const fetchClientCount = async () => {
    try {
      const response = await axios.get('http://localhost:3001/countConnectedClients');
      setClientCount(response.data.count); // Assuming the endpoint returns an object with a count property
    } catch (error) {
      console.error('Failed to fetch client count:', error);
    }
  };

  const handleConnect = () => {
    setConnected(true);
    fetchClientCount(); // Refresh the client count after connecting
=======
import React, { useState } from 'react';
import './mainClientInterface.css';

const accountsData = [
  { id: 1, name: 'Account A' },
  { id: 2, name: 'Account B' },
  { id: 3, name: 'Account C' },
];

function ClientInterface() {
  const [connected, setConnected] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [clientCount, setClientCount] = useState(0); // State to track the number of connected clients

  const handleConnect = () => {
    setConnected(true);
>>>>>>> 3da80c1 (Add some static basic UI for the client)
    console.log('Connected to server!');
    setClientCount(prevCount => prevCount + 1); // Increment client count upon connection
  };

  const handleCheckboxChange = (accountId) => {
    setSelectedAccounts(prev => {
      if (prev.includes(accountId)) {
        return prev.filter(id => id !== accountId);
      } else {
        return [...prev, accountId];
      }
    });
  };

  return (
    <div className="table-container">
      <h1>Client Trade Copier Interface</h1>
<<<<<<< HEAD
<<<<<<< HEAD
      <div className="client-count">Current Connections: {clientCount}</div>
      <table className="table">
        <thead>
          <tr>
            <th>Bag TO Track</th>
=======
=======
      <div className="client-count">Current Connections: {clientCount}</div> {/* Display the number of connected clients */}
>>>>>>> 8457a3e (Add some segment to the UI that actually show the number of the connected clients in live.)
      <table className="table">
        <thead>
          <tr>
            <th>Account Name</th>
>>>>>>> 3da80c1 (Add some static basic UI for the client)
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
<<<<<<< HEAD
          {tableData.map(account => (
=======
          {accountsData.map(account => (
>>>>>>> 3da80c1 (Add some static basic UI for the client)
            <tr key={account.id}>
              <td>{account.name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedAccounts.includes(account.id)}
                  onChange={() => handleCheckboxChange(account.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleConnect} disabled={connected} className="button">
        {connected ? 'Connected' : 'Connect to Server'}
      </button>
    </div>
  );
}

export default ClientInterface;
