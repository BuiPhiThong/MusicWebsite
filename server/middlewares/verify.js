const jwt = require("jsonwebtoken");
const asynHandler = require("express-async-handler");

const verifyToken = asynHandler(async (req, res, next) => {
  //kiểm tra token gửi từ req nằm trong header

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    //nếu bắt đầu bằng (bearner token) thì tách riêng lấy token
    const token = req?.headers?.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if(err){
            return res.status(401).json({
                success: false,
                mess: 'Invalid access token!'
            })
        }else{
            req.user = decode
            next()
        }
    });
  } else {
    return res.status(401).json({
      success: false,
      mess: "Require Authentication!!!!",
    });
  }
});


const isAdmin = asynHandler(async(req,res,next)=>{
    const {role} = req.user
    
    if(role!='Admin'){
        return res.status(401).json({
            success: false,
            mess:'Require Admin Role!!!'
        })
    }
    next()
})


module.exports={
    verifyToken,isAdmin
}
