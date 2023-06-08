const { hash, compare } = require('bcryptjs');
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
        const { name, email, password, old_password } = request.body;
        const id = request.user.id;

        const user = await knex('users').select('*').where('id', id).first();

        if(!user){
            throw new AppError('User not found');
        }

        user.name = name ;
        user.email = email;
        
        const userWithEamilExist = await knex('users').select('*');
        const result = userWithEamilExist.find(mail => mail.email === email);

        if(result && result.id !== user.id){
            throw new AppError('This email is already in use!')
        }

        if(password && !old_password){
            throw new AppError('Enter current password!')
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password)

            if(!checkOldPassword){
                throw new AppError('Current password is incorrect!')
            }

            user.password = await hash(password, 8)
        }
        
        await knex('users').where({id}).update({name: user.name , email: user.email, password: user.password})

        response.json()
            
    }
}
module.exports = UsersController;