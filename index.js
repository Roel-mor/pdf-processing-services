// Import the express library
const express = require('express');
const app = express();

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, PDF Processing Service!');
});

// Ensure the server listens on the correct port
const port = process.env.PORT || 10000; // Render sets the PORT environment variable
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

