import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './permissionGivenSources.css';

const DataTable = () => {
  const [tracking, setTracking] = useState({});
  const [tableData, setTableData] = useState([]);
  const [clientCount, setClientCount] = useState(0);
  const [newSourceName, setNewSourceName] = useState('');
  const serverIP = "185.241.5.114";
  const serverPort = 2648;
  useEffect(() => {
    const storedTrackingData = localStorage.getItem('trackingData');
    if (storedTrackingData) {
      setTracking(JSON.parse(storedTrackingData));
    }
    fetchDestinationsToTracking();
    fetchClientCount();
  }, []);

  useEffect(() => {
    localStorage.setItem('trackingData', JSON.stringify(tracking));
  }, [tracking]);

  const fetchDestinationsToTracking = async () => {
    try {
      const response = await axios.get(`http://${serverIP}:${serverPort}/getDestinationsTracking`);
      const destinations = response.data;
      setTableData(destinations.map((destination, index) => ({
        id: index,
        name: destination  
      })));
      const initialTracking = destinations.reduce((acc, destination, index) => {
        return acc[index] !== undefined ? acc : {...acc, [index]: false};
      }, JSON.parse(localStorage.getItem('trackingData') || '{}'));
      setTracking(initialTracking);
    } catch (error) {
      console.error('Failed to fetch destinations:', error.response ? error.response.data : error.message);
    }
  };

  const fetchClientCount = async () => {
    try {
      console.log('Inside the fetchClientCount ... ')
      const response = await axios.get(`http://${serverIP}:${serverPort}/countConnectedClients`);
      console.log(`Inside the fetchClientCount response.data = ${response.data}`)
      
      setClientCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch client count:', error);
    }
  };

  const handleCheckboxChange = (id) => {
    setTracking(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSource = async () => {
    if (!newSourceName.trim()) {
      alert('Source name cannot be empty');
      return;
    }
    try {
      const response = await axios.post(`http://${serverIP}:${serverPort}/addSource`, { sourceName: newSourceName });
      alert(response.data);
      const newId = tableData.length;
      setTableData([...tableData, { id: newId, name: newSourceName }]);
      setTracking(prev => ({ ...prev, [newId]: false }));
      setNewSourceName('');
      fetchDestinationsToTracking();
    } catch (error) {
      console.error('Error adding source:', error.response ? error.response.data : error.message);
      alert('Error adding source: ' + (error.response ? error.response.data : error.message));
    }
  };

  const handleDeleteSource = async (sourceName, id) => {
    try {
      const response = await axios.delete(`http://${serverIP}:${serverPort}/deleteSource?sourceName=${encodeURIComponent(sourceName)}`);
      alert(response.data);
      setTableData(prev => prev.filter(item => item.id !== id));
      const newTracking = {...tracking};
      delete newTracking[id];
      setTracking(newTracking);
    } catch (error) {
      console.error('Error deleting source:', error.response ? error.response.data : error.message);
      alert('Error deleting source: ' + (error.response ? error.response.data : error.message));
    }
  };

  const handleSubmit = async () => {
    console.log('Permissions given for:', tracking);
    try {
      const response = await axios.post(`http://${serverIP}:${serverPort}/updatePermissions`, tracking);
      console.log('Permissions updated:', response.data);
      alert('Permissions successfully updated.');
      fetchClientCount();
    } catch (error) {
      console.error('Failed to update permissions:', error.response ? error.response.data : error.message);
      alert('Failed to update permissions.');
    }
  };

  return (
    <div className="table-container">
      <h1>Server Trade Copier Interface</h1>
      <div className="client-count">Current Connections: {clientCount}</div>
      <table className="table">
        <thead>
          <tr>
            <th>Sources</th>
            <th>Allowed Tracking</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((source) => (
            <tr key={source.id}>
              <td>{source.name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={!!tracking[source.id]}
                  onChange={() => handleCheckboxChange(source.id)}
                />
              </td>
              <td>
                <button onClick={() => handleDeleteSource(source.name, source.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <input
          type="text"
          value={newSourceName}
          onChange={e => setNewSourceName(e.target.value)}
          placeholder="Add new source name"
        />
        <button onClick={handleAddSource}>Add Source</button>
      </div>
      <button className="button" onClick={handleSubmit}>Give Permissions!</button>
    </div>
  );
};

export default DataTable;
