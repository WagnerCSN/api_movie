const { verify } = require("jsonwebtoken");
const authConfig = require("../configs/auth");
const AppEror = require("../utils/AppError");

function ensureAuthenticated(request, response, next) {
    const authReader = request.headers.authorization;

    if(!authReader){
        throw new AppEror("JWT token não informado", 401);
    }

    const [, token] = authReader.split(" "); //Bearer xxxxx

    try{
      const {sub: user_id} = verify(token, authConfig.jwt.secret);

      request.user = {
        id: Number(user_id),
      };
      return next();
    }catch{
        throw new AppEror("JWT token inválido", 401);
    }
}

module.exports = ensureAuthenticated;