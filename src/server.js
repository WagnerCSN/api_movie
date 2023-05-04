require('express-async-errors')
const AppError = require('./utils/AppError')
const express = require('express');
const routes = require('./routes')
const app = express();

app.use(express.json());

const Port = 3333;

app.use(routes);

app.use((error, request, response, next) => {
    if(error instanceof AppError){
        response.status(error.statusCode).json({
            status: 'error',
            message: error.message
        })
    }

    console.error(error);

    response.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
})

app.listen(Port, () => console.log(`Server is running on Port ${Port}`));
