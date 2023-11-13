const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');
const db = require('./models/db'); // Importing the separated database connection

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', userRoutes); // Prefix routes with /api/users for clarity

const PORT = 3001;
// Test DB connectio
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
