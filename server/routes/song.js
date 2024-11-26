const router = require('express').Router()

const ctrls = require('../controller/song')
const {isAdmin,verifyToken} = require('../middlewares/verify')
const uploader = require('../config/cloudinary.config')

router.post('/',ctrls.createSong)
router.put('/:soid',ctrls.updateSong)
router.put('/uploadimage/:soid',[verifyToken,isAdmin],uploader.single('songImg'),ctrls.uploadImageSong)
router.put('/:soid/increaselistion',ctrls.incListMusic)
router.put('/:soid/audioPath',ctrls.updateAudioPath)
router.delete('/:soid',ctrls.deleteSong)
router.get('/',ctrls.listSongContribute)

module.exports=router

