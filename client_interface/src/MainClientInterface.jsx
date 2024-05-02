import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './mainClientInterface.css';

function ClientInterface() {
  const [tableData, setTableData] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [newAccountName, setNewAccountName] = useState('');

  
  useEffect(() => {
    const updateClientDestinations = async () => {
      const host = 'localhost'; // Change this to your host
      const port = 2648; // Change this to your port
      const endpoint = '/update-client-destinations';

      const url = `http://${host}:${port}${endpoint}`;

      

      console.log('Inside the update cllient ')
      try {
        const response = await axios.put(url, {
          clientDestinations: tableData.map(account => account.name)
        });
        console.log('Settings file updated:', response.data);
      } catch (error) {
        console.error('Error updating settings file:', error);
      }
    };

    const interval = setInterval(() => {
      updateClientDestinations();
    }, 2000);

    return () => clearInterval(interval);
  }, [tableData]);

  const handleAddAccount = () => {
    if (newAccountName.trim()) {
      const newAccount = {
        id: Date.now(), // Use a unique identifier for the id
        name: newAccountName.trim()
      };
      setTableData([...tableData, newAccount]);
      setNewAccountName('');
    }
  };

  const handleDeleteAccount = (accountId) => {
    setTableData(tableData.filter(account => account.id !== accountId));
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
      <table className="table">
        <thead>
          <tr>
            <th>Bag TO Track</th>
            <th>Select</th>
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
                  checked={selectedAccounts.includes(account.id)}
                  onChange={() => handleCheckboxChange(account.id)}
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
