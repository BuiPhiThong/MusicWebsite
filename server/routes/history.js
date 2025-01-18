const router = require('express').Router()
const { verify } = require('jsonwebtoken')
const ctrls = require('../controller/history')
const { verifyToken } = require('../middlewares/verify')

router.post('/',[verifyToken], ctrls.createHistory)

module.exports=router 