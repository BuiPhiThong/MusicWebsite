const router = require('express').Router()
const ctrls = require('../controller/user')
const {isAdmin,verifyToken} = require('../middlewares/verify')
const uploader = require('../config/cloudinary.config')


router.post('/register',ctrls.register) 
router.get('/finalregister/:token',ctrls.finalRegister) 

router.post('/login',ctrls.login) 
router.post('/refreshaccesstoken',ctrls.refreshToken) 

router.post('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword/:token', ctrls.resetPassword)

router.post('/logout',[verifyToken],ctrls.logout) 
router.get('/',[verifyToken,isAdmin],ctrls.getAllUser) 

router.get('/current',[verifyToken],ctrls.getCurrent) 

// router.put('/uploadimage/:uid',[verifyToken,isAdmin],uploader.single('avatar'),ctrls.uploadImageUser)

router.put('/',[verifyToken],[uploader.single('avatar')] ,ctrls.updateUser)
router.post('/createwislist/:sid?',[verifyToken],ctrls.createWishlist)
router.post('/saveplaylist/:slug',[verifyToken],ctrls.saveAPlaylist)
router.post('/saveplaylist2/:slug',[verifyToken],ctrls.saveAPlaylist2)
router.put('/updatewishlist/:sid',[verifyToken],ctrls.updateWishlist)
router.put('/changepassword/',[verifyToken],ctrls.changePassword)
router.put('/deletedwishlist/:wid',[verifyToken],ctrls.deletedWishlist)
router.delete('/deletedallwishlist',[verifyToken],ctrls.deletedAllWishlist)
router.put('/removesongsearchwishlist',[verifyToken],ctrls.removeSongSearchWishlist)
router.put('/updateWishlistInManageAccount',[verifyToken],[uploader.single('image')] ,ctrls.updateWishlistInManageAccount                                                                                                                                                                                                )

module.exports = router