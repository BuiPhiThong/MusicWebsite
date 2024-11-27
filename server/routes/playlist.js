const router = require('express').Router()

const ctrls = require('../controller/playlist')
const {isAdmin,verifyToken} = require('../middlewares/verify')

router.post('/',[verifyToken,isAdmin],ctrls.createPlaylist)
router.put('/:plid',[verifyToken,isAdmin],ctrls.updatePlaylist)
router.put('/updatesong/:plid',[verifyToken,isAdmin],ctrls.addSongtoPlaylist)
router.delete('/:plid',[verifyToken,isAdmin],ctrls.deletePlaylist)
router.get('/',ctrls.getPlaylist)

module.exports=router

