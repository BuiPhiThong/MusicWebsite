const router = require('express').Router()
const ctrls = require('../controller/user')
const {isAdmin,verifyToken} = require('../middlewares/verify')
const uploader = require('../config/cloudinary.config')


router.post('/register',ctrls.register) 
router.post('/login',ctrls.login) 
router.post('/refreshaccesstoken',ctrls.refreshToken) 
router.get('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassword)
router.post('/logout',[verifyToken],ctrls.logout) 
router.get('/',[verifyToken,isAdmin],ctrls.getAllUser) 
router.get('/current',[verifyToken],ctrls.getCurrent) 

// router.put('/uploadimage/:uid',[verifyToken,isAdmin],uploader.single('avatar'),ctrls.uploadImageUser)

router.put('/:uid',[uploader.single('avatar')] ,ctrls.updateUser)

module.exports = router