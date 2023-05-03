class UsersController{
    create(request, response){
        const {name, email, senha} = request.body;
        response.json({name, email, senha})
    }
}

module.exports = UsersController;