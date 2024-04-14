
const express = require('express');
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());





const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
