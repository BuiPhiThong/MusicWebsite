const router = require('express').Router()

const ctrl = require('../controller/searchHome')

router.get('/',ctrl.searchHome)
router.get('/bai-hat',ctrl.searchHome1)
router.get('/ca-sy',ctrl.searchHome2)
router.get('/danh-sach',ctrl.searchHome3)

module.exports=router