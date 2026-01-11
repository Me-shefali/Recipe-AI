// Load environment variables from .env file
require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 5001;

// const uri = process.env.MONGODB_URI;

// mongoose.connect(uri)
//   .then(() => console.log('Connected to MongoDB Atlas'))
//   .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

