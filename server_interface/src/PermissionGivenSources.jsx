import React, { useState } from 'react';
import './permissionGivenSources.css'; // Make sure the import path is correct

const DataTable = () => {
  const [tracking, setTracking] = useState({});

  const dataSources = [
    { id: 1, name: 'First Source' },
    { id: 2, name: 'Second Source' },
    { id: 3, name: 'Third Source' }
  ];

  const handleCheckboxChange = (id) => {
    setTracking(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    console.log('Permissions given for:', tracking);
    alert('Permissions updated.');
  };

  return (
    <div className="table-container"> {}
      <table className="table">
        <thead>
          <tr>
            <th>Sources</th>
            <th>Allowed Tracking</th>
          </tr>
        </thead>
        <tbody>
          {dataSources.map((source) => (
            <tr key={source.id}>
              <td>{source.name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={!!tracking[source.id]}
                  onChange={() => handleCheckboxChange(source.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="button" onClick={handleSubmit}>Give Permissions!</button>
    </div>
  );
};

export default DataTable;
