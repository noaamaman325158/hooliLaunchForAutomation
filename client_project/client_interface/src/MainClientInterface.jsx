import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './mainClientInterface.css';

function ClientInterface() {
  const [tableData, setTableData] = useState([]);
  const [tracking, setTracking] = useState({});
  const [newAccountName, setNewAccountName] = useState('');
  const host = '185.241.5.114';
  const port = 2648;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:2649/getClientDestinationsTracking`);
        const destinations = response.data;
        setTableData(destinations.map((destination, index) => ({
          id: index,
          name: destination
        })));

        const initialTracking = destinations.reduce((acc, destination, index) => ({
          ...acc,
          [index]: acc[index] !== undefined ? acc[index] : false
        }), JSON.parse(localStorage.getItem('trackingData') || '{}'));
        setTracking(initialTracking);
      } catch (error) {
        console.error('Failed to fetch destinations:', error.response ? error.response.data : error.message);
      }
    };

    fetchData();
  }, [host, port]);

  // Save tracking data to localStorage on changes
  useEffect(() => {
    localStorage.setItem('trackingData', JSON.stringify(tracking));
  }, [tracking]);

  const handleAddAccount = async () => {
    if (!newAccountName.trim()) {
      alert('Account name cannot be empty');
      return;
    }
    try {
      // Send a POST request to the /addSource endpoint with the new account name
      const response = await axios.post(`http://127.0.0.1:2649/addSource`, { sourceName: newAccountName.trim() });
  
      // Check response status or data here if necessary, e.g.:
      if (response.status === 200) {
        // Assuming the server responds with the added account data or a success message
        const newAccount = {
          id: tableData.length, // Or derive from response if ID is returned from server
          name: newAccountName.trim()
        };
        setTableData([...tableData, newAccount]);
        setTracking(prev => ({ ...prev, [newAccount.id]: false }));
        setNewAccountName('');
        alert('Account added successfully');
      } else {
        throw new Error(response.data || 'Failed to add account');
      }
    } catch (error) {
      // Handle errors from the server response or connection issues
      console.error('Error adding account:', error.response ? error.response.data : error.message);
      alert('Error adding account: ' + (error.response ? error.response.data : error.message));
    }
  };
  

  const handleDeleteAccount = async (accountId) => {
    const accountName = tableData.find(account => account.id === accountId).name;
  
    try {
      // Send a DELETE request to the /deleteSource endpoint with the account name as a query parameter
      const response = await axios.delete(`http://${host}:${port}/deleteSource`, {
        params: { sourceName: accountName }
      });
  
      // Check response status or data here if necessary, e.g.:
      if (response.status === 200) {
        // Update local state to remove the account from the UI
        setTableData(prev => prev.filter(account => account.id !== accountId));
        const updatedTracking = { ...tracking };
        delete updatedTracking[accountId];
        setTracking(updatedTracking);
        alert('Account deleted successfully');
      } else {
        throw new Error(response.data || 'Failed to delete account');
      }
    } catch (error) {
      // Handle errors from the server response or connection issues
      console.error('Error deleting account:', error.response ? error.response.data : error.message);
      alert('Error deleting account: ' + (error.response ? error.response.data : error.message));
    }
  };
  
  const toggleTracking = (accountId) => {
    setTracking(prev => ({ ...prev, [accountId]: !prev[accountId] }));
  };

  return (
    <div className="table-container">
      <h1>Client Trade Copier Interface</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Account</th>
            <th>Tracking</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(account => (
            <tr key={account.id}>
              <td>{account.name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={!!tracking[account.id]}
                  onChange={() => toggleTracking(account.id)}
                />
              </td>
              <td>
                <button onClick={() => handleDeleteAccount(account.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <input
          type="text"
          value={newAccountName}
          onChange={(e) => setNewAccountName(e.target.value)}
          placeholder="Enter new account name"
        />
        <button onClick={handleAddAccount}>Add Account</button>
      </div>
    </div>
  );
}

export default ClientInterface;
