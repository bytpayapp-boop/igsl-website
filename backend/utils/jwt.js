const jwt = require ('jsonwebtoken')

const generateAccessToken = (payload)=>{
    const token = jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:'1h'
    });
    return token
}

const generateRefreshToken = (payload)=>{
    const token = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{
        expiresIn:'7d'
    });
    return token;
}

const verifyAccessToken =(token)=>{
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:',verified)
    return verified
}

const verifyRefreshToken =(token)=>{
    const verified = jwt.verify(token,process.env.JWT_REFRESH_SECRET)
    console.log('Refresh token verified successfully:',verified);
    return verified
}

const generateBothTokens = (payload)=>{
    return {accessToken:generateAccessToken(payload),refreshToken:generateRefreshToken(payload)}
}


module.exports ={
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateBothTokens
}