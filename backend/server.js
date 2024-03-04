const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require ('./routes/orderRoutes');
const tableRoutes = require ('./routes/tableRoutes');
const path = require('path');  // Import the path module

const authenticateToken = require('./middleware/authenticateToken');

const db = require('./models/db'); 

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

app.use('/api', authenticateToken, userRoutes);
app.use('/api', authenticateToken, inventoryRoutes);
app.use('/api', authenticateToken, orderRoutes);
app.use('/api', authenticateToken, tableRoutes);

//public route
app.post('api/check-password', userController.checkPassword);


app.use("/", function(req, res) {
  res.send("server  is running !");
});



const PORT = 3010;
// Test DB connectio
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
