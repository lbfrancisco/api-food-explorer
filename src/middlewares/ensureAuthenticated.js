const { verify } = require('jsonwebtoken');
const authConfig = require('../configs/auth');

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      error: 'JWT token is missing',
    });
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(token, authConfig.jwt.secret);

    request.user = {
      id: Number(userId),
    };

    return next();
  } catch {
    return response.status(401).json({
      error: 'JWT token is missing',
    });
  }
}

module.exports = ensureAuthenticated;
