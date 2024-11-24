const router = require('express').Router()

const ctrls = require('../controller/singer')
const {isAdmin,verifyToken} = require('../middlewares/verify')

router.post('/',[verifyToken,isAdmin],ctrls.createSinger)
router.get('/',ctrls.listSinger)
router.put('/follow/:sid',[verifyToken],ctrls.userFollow)
router.put('/updateplaylist/:sid',[verifyToken,isAdmin],ctrls.updatePlayListSinger)
router.put('/createplaylist/:sid',[verifyToken,isAdmin],ctrls.createPlayListSinger)
router.put('/:sid',[verifyToken,isAdmin],ctrls.updateSinger)
router.delete('/:sid',[verifyToken,isAdmin],ctrls.deleteSinger)

module.exports=router

