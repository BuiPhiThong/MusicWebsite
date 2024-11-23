const router = require('express').Router()

const ctrls = require('../controller/song')
const {isAdmin,verifyToken} = require('../middlewares/verify')

router.post('/',ctrls.createSong)
router.put('/:soid',ctrls.updateSong)
router.put('/:soid/increaselistion',ctrls.incListMusic)
router.put('/:soid/audioPath',ctrls.updateAudioPath)
router.delete('/:soid',ctrls.deleteSong)
router.get('/',ctrls.listSong)

module.exports=router

