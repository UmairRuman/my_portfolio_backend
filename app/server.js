const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const projectRoutes = require('../app/backend/src/routes/projects');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(express.json());
app.use('/utils/images', express.static(path.join(__dirname, 'backend', 'src', 'utils', 'images')));
app.use(cors({ origin: 'https://UmairRumanPortfolio.netlify.app' }));

const connectDB = require('../app/backend/src/config/db'); 
connectDB().catch(err => console.log(`MongoDB connection error: ${err.message}`));

app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));