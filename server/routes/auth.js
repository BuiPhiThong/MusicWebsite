const router = require("express").Router();
const passport = require('passport')
router.get("/google",passport.authenticate("google", { scope: ["profile","email"]  ,session:false}));

router.get("/google/callback",(req,res,next)=>{
  passport.authenticate("google",(err,infoUser)=>{
      req.user = infoUser
      next()
  })(req,res,next)

},(req,res)=>{
  const {accessToken,userData,refreshToken}= req.user
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.redirect(`${process.env.URL_CLIENT}/login?accessToken=${accessToken}`);
  // res.status(200).json({
  //   message: "Login successful",
  //   accessToken
  // });

});

module.exports = router;
