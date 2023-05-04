const {hash} = require('bcryptjs');
const knex = require('../database/knex');
const AppError = require('../utils/AppError')

class UsersController{
    async create(request, response){
        const {name, email, password} = request.body;
        
       

        const hashedpassword = await hash(password, 8);
        
        const checkUserExist = await knex("users").select('*').where('name', name).first();
        const checkEmailExist = await knex("users").select('*').where('email', email).first();
       
        if(checkUserExist){
            throw new AppError("User already exists!")
        }

        if(checkEmailExist){
            throw new AppError("Email not allowed")
        }

        await knex("users").insert({
            name, 
            email, 
            password: hashedpassword,
        })
        response.json();
        }

    async update(request, response){
        const {name, email} = request.body;
        const {id} = request.params;

        const user = await knex('users').select('*').where('id', id).first();

        if(!user){
            throw new AppError('User not found');
        }

        const userWithUpdateEamil = await knex('users').select('*').where('email', email).first();

        if(userWithUpdateEamil && userWithUpdateEamil.id !== user.id){
            throw new AppError('This email is already in use!')
        }
        
        user.name = name;
        user.email = email;

        await knex('users').where({id}).update({name: name , email: email})

        response.json()
            
    }

}

module.exports = UsersController;