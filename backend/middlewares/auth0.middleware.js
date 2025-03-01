const { expressJwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: `https://dev-kcin01emllhdvvyx.us.auth0.com/.well-known/jwks.json`
  }),
  algorithms: ['RS256'],
});

module.exports = checkJwt;
