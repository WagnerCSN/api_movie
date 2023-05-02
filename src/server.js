const express = require('express');
const routes = require('./routes')
const app = express();

app.use(express.json());

const Port = 3333;

app.use(routes);

app.listen(Port, () => console.log(`Server is running on Port ${Port}`));
