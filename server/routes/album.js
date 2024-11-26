const router = require('express').Router()

const ctrls = require('../controller/album')
const {isAdmin,verifyToken} = require('../middlewares/verify')

router.post('/',[verifyToken,isAdmin],ctrls.createAlbum)
router.put('/:aid',[verifyToken,isAdmin],ctrls.updateAlbum)
router.delete('/:aid',[verifyToken,isAdmin],ctrls.deleteAlbum)
router.get('/',ctrls.listAlbum)

module.exports=router

