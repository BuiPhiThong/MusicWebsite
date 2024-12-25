const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const passport = require("passport");
const User = require("./model/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {genAccessToken,genRefreshToken} = require('./middlewares/jwt')
passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async function (accessToken, refreshToken, profile, cb) {      
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          // Tạo người dùng mới nếu chưa tồn tại
          
          const hashedPassword = await bcrypt.hash("randompassword", 10);
          user = new User({
            firstname: profile.name?.givenName,
            lastname: profile.name?.familyName,
            email: profile.emails[0].value,
            password: hashedPassword,
            typeLogin:profile?.provider
          });
          await user.save();
        }
        const {password,role,...userData} = user.toObject()
        const accessToken = genAccessToken(user._id,role)
        const refreshToken = genRefreshToken(user._id,role)

        await User.findByIdAndUpdate(user._id,{refreshToken:refreshToken},{new:true})
        
        return cb(null, {accessToken: accessToken,userData:userData,refreshToken:refreshToken});
      } catch (error) {
        console.log(error);
        return cb(null, profile);
      }
    }
  )
);
