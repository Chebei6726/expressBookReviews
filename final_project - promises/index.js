const express = require('express');
const jwt = require('jsonwebtoken');
const {authenticated,verifyToken} = require('./router/auth_users.js');
const genl_routes = require('./router/general.js').general;
require("dotenv").config();

const app = express();

app.use(express.json());
app.use("/customer", authenticated);
app.use("/", genl_routes);
app.use("/customer/auth", verifyToken);


const PORT = 5000;
app.listen(PORT, () => console.log("Server is running " + PORT));

