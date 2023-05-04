const {hash} = require('bcryptjs');
const knex = require('../database/knex');
const AppError = require('../utils/AppError')

class UsersController{
  async  create(request, response){
        const {name, email, password} = request.body;
        
       

        const hashedpassword = await hash(password, 8);
        
        const checkUserExist = await knex("users").select('*').where('email', email).first();
       
        if(checkUserExist){
            throw new AppError("Email já existe!")
        }
        await knex("users").insert({
            name, 
            email, 
            password: hashedpassword,
        })
        response.json();
    }
}

module.exports = UsersController;