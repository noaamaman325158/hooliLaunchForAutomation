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
        const response = await axios.get('http://localhost:3003/getDestinationsAllowTracking');
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
      const response = await axios.get('http://localhost:3003/countConnectedClients');
      console.log(`${response.data.count}`)
      setClientCount(response.data.count); 
    } catch (error) {
      console.error('Failed to fetch client count:', error);
    }
  };

  const handleConnect = () => {
    setConnected(true);
<<<<<<< HEAD
>>>>>>> 3da80c1 (Add some static basic UI for the client)
=======
    fetchClientCount(); // Refresh the client count after connecting
>>>>>>> 2b4d497 (Inetgration of the clients counter with the backend)
    console.log('Connected to server!');
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
      <div className="client-count">Current Connections: {clientCount}</div>
      <table className="table">
        <thead>
          <tr>
<<<<<<< HEAD
            <th>Account Name</th>
>>>>>>> 3da80c1 (Add some static basic UI for the client)
=======
            <th>Bag TO Track</th>
>>>>>>> 2b4d497 (Inetgration of the clients counter with the backend)
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(account => (
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
