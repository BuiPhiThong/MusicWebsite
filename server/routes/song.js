const router = require('express').Router()

const ctrls = require('../controller/song')
const {isAdmin,verifyToken} = require('../middlewares/verify')
const uploader = require('../config/cloudinary.config')

router.post('/',ctrls.createSong)
router.get('/',ctrls.listSongContribute)
router.get('/getall/:type',[verifyToken,isAdmin],ctrls.getAllSong)
router.put('/:soid',ctrls.updateSong)
router.put('/uploadimage/:soid',[verifyToken,isAdmin],uploader.single('songImg'),ctrls.uploadImageSong)
router.put('/increaselistion/:soid',[verifyToken],ctrls.incListMusic)
router.put('/:soid/audioPath',ctrls.updateAudioPath)
router.delete('/:soid',ctrls.deleteSong)
router.get('/topone/:cid',ctrls.getTop1SongByIdC)
router.get('/toptwo/:cid',ctrls.getTop2SongByIdC)
router.get('/topthree/:cid',ctrls.getTop3SongByIdC)
router.get('/top4to10/:cid',ctrls.getTop4To10SongByIdC)
router.get('/homesearch',ctrls.searchHome)
router.post('/updateslugs', [verifyToken, isAdmin], ctrls.updateSongsSlugs);

module.exports=router

