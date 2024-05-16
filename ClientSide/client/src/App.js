import React, {useState, useEffect} from 'react';
import io from 'socket.io-client'; 
// storing socket connection in this global variable
let socket = null;


function handleClick() {
  // we emit this event that increments the count on the server
  // and the updated count is emitted back via 'counter updated'
  socket.emit('counter clicked');
}


function App() {

  const host = '185.241.5.114';
  const port = 1234;
  const [destination, setDestination] = useState("Sim108"); 
  const [allDestinations, setAllDestinationsData]=useState(["Sim102", "Sim103"]); 
  

  // after component mount...
  useEffect(() => {
    // connect to the socket server
    socket = io("ws://127.0.0.1:2222");
    
  }, []);
  const handleAddAccount = async(value)=>{
    setAllDestinationsData([...allDestinations,destination ])
    socket.emit('AddDestination', destination);
  }
  
  const handleDeleteAccount=async(row)=>{
    console.log(row);
    const newArray = allDestinations.filter((item, index) => item !== row);
    setAllDestinationsData(newArray); // Updates the state with the new array
    socket.emit('DeleteDestination', row);
  }
  return (
    
    <div className="table-container">
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
        placeholder="Enter destintion name"
      />
      <button onClick={handleAddAccount}>Add Account</button>
    </div>
  </div>
  );
}

export default App;
