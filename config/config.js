module.exports = {
    db: {
      connectionString: process.env.DB_CONNECTION_STRING || "server=localhost;Port=3306;user=root;password=qwerty;database=CibusDb",
      dialect: 'mysql',
      host: process.env.HOST || 'localhost',
      port: 3306,
      database: 'CibusDb',
      username: 'root',
      password: 'qwerty',
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      }
    },
    jwt: {
      key: process.env.JWT_KEY || "CibusTokenSecretCibusTokenSecret",
      issuer: process.env.JWT_ISSUER || "CibusTokenSecretCibusTokenSecret",
      audience: process.env.JWT_AUDIENCE || "CibusTokenSecretCibusTokenSecret",
      expirationInMinutes: process.env.JWT_EXPIRATION || 43200,
    },
    log: {
     
    }
  };
  