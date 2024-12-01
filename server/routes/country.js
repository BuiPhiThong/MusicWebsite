const router = require('express').Router()

const ctrls = require('../controller/country')
const {isAdmin,verifyToken} = require('../middlewares/verify')

router.post('/',[verifyToken,isAdmin],ctrls.createCountry)
router.put('/:cid',[verifyToken,isAdmin],ctrls.updateCountry)
router.delete('/:cid',[verifyToken,isAdmin],ctrls.deleteCountry)
router.get('/',ctrls.listCountries)
router.get('/top3',ctrls.listTop3Country)

module.exports=router

