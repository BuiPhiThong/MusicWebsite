const jwt = require('jsonwebtoken')

const genAccessToken = (uid,role)=>{
    return jwt.sign({_id:uid,role:role},process.env.JWT_SECRET, {expiresIn:'3d'})
}

function genRefreshToken(userId, role) {
    return jwt.sign(
        { _id: userId, role: role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}
module.exports={
    genAccessToken,
    genRefreshToken
}