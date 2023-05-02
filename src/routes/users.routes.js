const { Router } = require('express');
const usersRoutes = Router();

usersRoutes.post("/", (request, response) => {
    const {name, email, senha} = request.body;
    response.json({name, email, senha})
});

module.exports = usersRoutes;