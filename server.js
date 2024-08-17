require('./config/db');

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());

const UserRouter = require('./api/User');
const bodyParser = require("express").json;
// Middleware
app.use(express.json());
app.use('/user', UserRouter);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);  
});
