const router = require('express').Router();

const ctrls = require('../controller/playlist');
const { isAdmin, verifyToken } = require('../middlewares/verify');

router.post('/', [verifyToken, isAdmin], ctrls.createPlaylist);
router.put('/:plid', [verifyToken, isAdmin], ctrls.updatePlaylist);
router.put('/updatesong/:plid', [verifyToken, isAdmin], ctrls.addSongtoPlaylist);
router.delete('/:plid', [verifyToken, isAdmin], ctrls.deletePlaylist);
router.get('/', ctrls.getPlaylist);
router.get('/:tid', ctrls.getPlayListByTypeId); // Đây là đường dẫn GET chính xác
router.get('/listenplaylist/:slug', ctrls.getPlaylistBySlug); // Đây là đường dẫn GET chính xác
router.post('/updateslugs',[verifyToken,isAdmin],ctrls.updateSlugManyPlaylist)
module.exports = router;