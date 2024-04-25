const cors = require('cors');
const express = require('express');
const adminRoutes = require('./routes/adminRoutes'); // Update the path as necessary
const app = express();

// Enable CORS
app.use(cors());

app.use(express.json());
app.use('/api', adminRoutes);



const bodyParser = require('body-parser');




// Enable bodyParser for JSON
app.use(bodyParser.json());

// Enable bodyParser for URL encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set up a simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend API.' });
});

// Set the port for the server
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
