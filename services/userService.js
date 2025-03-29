const HashService = require('./hashService');
const JwtService = require('./JwtService');
const jwtService = new JwtService() ;
const Repository =  require('../repositories/repository');
const repository = new Repository();
class UserService {

  constructor() {

  }


  async login( userName, password ) {
    // Hash the password before checking.
    const hashedPassword = HashService.calculateHash(password, userName);
    const userEntity = await repository.login(userName, hashedPassword);
    if (userEntity) {
      const token = jwtService.generateSecurityToken_ByName(userEntity.userName, userEntity.id);
      const loginResult = {
        token: token,
        userId: userEntity.id.toString()
      };
      jwtService.saveToken(userEntity.id, token);
      return loginResult;
    } else {
      return null;
    }
  }

  async logout(token) {
    try {
      jwtService.removeToken(token);
      return true;
    } catch (error) {
      console.log(`Exception during logout: ${error.message}`);
      return false;
    }
  }

  async register(model) {
    // Hash the password.
    model.password = HashService.calculateHash(model.password, model.userName);
    const existingUser = await repository.getUserByUserName(model.userName);
    if (!existingUser) {
      const userEntity = {
        userName: model.userName,
        password: model.password
      };
      const newUser = await repository.addUser(userEntity);
      return newUser;
    } else {
      throw new Error(`User "${model.userName}" already exists. Please try with a different user name.`);
    }
  }

  async getUserId(token) {
    return jwtService.getUserId(token);
  }
}

module.exports = UserService;
