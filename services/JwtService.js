
const jwt = require('jsonwebtoken');

class JwtService {
  static tokenMap = new Map();
  constructor() {
    this.secret = 'CibusTokenSecretCibusTokenSecret';
    this.expDate = 4200; 
    
  }


  generateSecurityToken_ByName(userName, userId) {
    const payload = {
      name: userName,
      nameid: `${userId}`
    };
    // Convert minutes to seconds for the expiresIn option.
    const expiresIn = parseFloat(this.expDate) * 60;
    const token = jwt.sign(payload, this.secret, { expiresIn });
    return token;
  }


  isTokenExist(token) {
    return JwtService.tokenMap.has(token);
  }

  saveToken(id, token) {
    JwtService.tokenMap.set(token, id);
  }


  removeToken(token) {
    if (JwtService.tokenMap.has(token)) {
      JwtService.tokenMap.delete(token);
    }
  }


  getUserId(token) {
    return JwtService.tokenMap.get(token) || null;
  }
}

module.exports = JwtService;
