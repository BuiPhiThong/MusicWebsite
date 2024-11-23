const router = require('express').Router()
const ctrls = require('../controller/user')
const {isAdmin,verifyToken} = require('../middlewares/verify')


router.post('/register',ctrls.register) 
router.post('/login',ctrls.login) 
router.post('/refreshaccesstoken',ctrls.refreshToken) 
router.get('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassword)
router.post('/logout',[verifyToken],ctrls.logout) 
router.get('/getall',[verifyToken,isAdmin],ctrls.getAllUser) 


module.exports = router