const express = require('express');

const app = express();

const Port = 3333;

app.listen(Port, () => console.log(`Server is running on Port ${Port}`));
