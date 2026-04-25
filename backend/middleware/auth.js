const {generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateBothTokens} = require('../utils/jwt')

function authTokenMiddleWare(req, res, next){
    
try{
    const token = req.headers.authorization?.split(' ')[1];

if(!token){
    res.status(401).json({error:'Authorization token is required'});
    return;
}

console.log('Attempting to verify token:', token.substring(0, 20) + '...');

const payload = verifyAccessToken(token);
if(!payload){
    console.log('Verify access token returned null');
    res.status(401).json({error:'Invalid access token, or token expired'});
    return
}

console.log('Token verified for user',payload)

req.user= payload;

next()
}

catch(err){
    console.error('Auth middleware error:', err.message);
    res.status(401).json({error:`Error authenticating access token: ${err.message || err || 'Failed'}`})
}
}

function authRefreshMiddleware(req, res, next){

    try{
        const token = req.headers.authorization?.split(' ')[1];



    if (!token) {
      res.status(401).json({ error: 'Missing refresh token' });
      return;
    }

    const payload = verifyRefreshToken(token);
    if (!payload) {
      res.status(401).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    req.user = payload;
    next();
}
catch(err){
    res.status(401).json({error:`error verifying refresh token: ${err.message}`})
}
}

module.exports ={
    authTokenMiddleWare,
    authRefreshMiddleware
}