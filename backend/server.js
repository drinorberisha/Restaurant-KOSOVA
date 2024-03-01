const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require ('./routes/orderRoutes');
const tableRoutes = require ('./routes/tableRoutes');
const path = require('path');  // Import the path module

const db = require('./models/db'); 
console.log("Current Working Directory:", process.cwd()); 
console.log("Resolved database path:", path.resolve(__dirname, './restaurant-Kosova.db'));
const app = express();
const allowedOrigins = ['http://localhost:3000', 'https://restaurant-kosova.vercel.app']; // adjust as needed 
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // Allow requests without an 'origin' header (like mobile apps, etc.)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow sending of cookies and authentication headers
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api', userRoutes); 
app.use('/api', inventoryRoutes);
app.use('/api', orderRoutes);
app.use('/api', tableRoutes);
app.use("/", function(req, res) {
  res.send("server  is running !");
});



const PORT = 3010;
// Test DB connectio
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
