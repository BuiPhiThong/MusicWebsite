const router = require('express').Router()

const ctrls = require('../controller/musicType')
const {isAdmin,verifyToken} = require('../middlewares/verify')

router.post('/',[verifyToken,isAdmin],ctrls.createMusicType)
router.put('/:mtid',[verifyToken,isAdmin],ctrls.updateMusicType)
router.delete('/:mtid',[verifyToken,isAdmin],ctrls.deleteMusicType)
router.get('/',ctrls.listMusicType)

module.exports=router

