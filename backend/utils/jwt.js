const jwt = require ('jsonwebtoken')

// Remove JWT standard claims that shouldn't be manually set
const cleanPayload = (payload) => {
    const { exp, iat, jti, ...cleanedPayload } = payload
    return cleanedPayload
}

const generateAccessToken = (payload)=>{
    const cleanedPayload = cleanPayload(payload)
    const token = jwt.sign(cleanedPayload, process.env.JWT_SECRET, {
        expiresIn:'1h'
    });
    return token
}

const generateRefreshToken = (payload)=>{
    const cleanedPayload = cleanPayload(payload)
    const token = jwt.sign(cleanedPayload, process.env.JWT_REFRESH_SECRET, {
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