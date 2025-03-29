const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'CibusTokenSecretCibusTokenSecret';
const JwtService = require('../services/JwtService');
const jwtService = new JwtService() ;

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring("Bearer ".length).trim();
    try {
     // const decoded = jwt.verify(token, secret);
    //  req.user = decoded;
       const isUserExist = jwtService.isTokenExist(token);
       if (isUserExist)
       {
        req.token = token;
        return next();
       }
    
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
  return res.status(401).json({ message: 'Authorization header not found' });
};

module.exports = authenticate;