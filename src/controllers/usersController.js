const AppError = require('../utils/AppError');
const sqliteConection = require('../database/sqlite');
const {hash, compare} = require('bcryptjs');
const sqliteConnection = require('../database/sqlite');

class UsersController{
    async create(request, response){
        const {name, email, password} = request.body;

        const database = await sqliteConection();
        const checkUserExist = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if(checkUserExist){
            throw new AppError('Este email já está em uso!');
        }

        const hashedPassword = await hash(password, 8);

        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]
        )
        
        return response.status(201).json()
    }

    async update(request, response){
        const {name, email, password, oldpassword} = request.body;
        const user_id = request.user.id;

        const database = await sqliteConnection();

        const user = await database.get("SELECT * FROM USERS WHERE id = (?)", [user_id]);

        if(!user){
            throw new AppError("Usuário não encontrado")
        }

        const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
            throw new AppError("Email já existe")
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(password && !oldpassword){
            throw new AppError("Precisa informar a senha antiga!")
        }

        if(password && oldpassword){
            const checkOldPassword = await compare(oldpassword, user.password)

            if(!checkOldPassword){
                throw new AppError("A senha antiga não confere!")
            }

            user.password = await hash(password, 8)
        }    
    
        await database.run(`UPDATE users SET 
        name = ?, 
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?`,
        [user.name, user.email, user.password, user_id]);

        return response.json()

    }
}

module.exports = UsersController;