const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require ('./routes/orderRoutes');
const tableRoutes = require ('./routes/tableRoutes');

const db = require('./models/db'); 

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the origin of your frontend
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
