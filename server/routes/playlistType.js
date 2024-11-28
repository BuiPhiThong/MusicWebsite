const router = require('express').Router()

const ctrls = require('../controller/playlistType')
const {isAdmin,verifyToken} = require('../middlewares/verify')

router.post('/',[verifyToken,isAdmin],ctrls.createTypePLaylist)
router.put('/:ltid',[verifyToken,isAdmin],ctrls.updateTypePlaylist)
router.delete('/:ltid',[verifyToken,isAdmin],ctrls.deleteTypePlaylist)
router.get('/',ctrls.listTypePlaylist)

module.exports=router

