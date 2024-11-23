const Singer = require('../model/singer')
const asynHandler = require('express-async-handler')


const createSinger = asynHandler(async(req,res)=>{
    const {singerName,national}= req.body
    if(!singerName || !national) throw new Error('Missing input!')

    const response = await Singer.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        mess: response ? response: 'Create failed!'
    })
})
const updateSinger = asynHandler(async(req,res)=>{
    const {sid}= req.params
    if(!sid) throw new Error('Missing input!')

    const response = await Singer.findByIdAndUpdate(sid,req.body,{new:true})
    return res.status(200).json({
        success: response ? true : false,
        mess: response ? response: 'Update failed!'
    })
})
const deleteSinger = asynHandler(async(req,res)=>{
    const {sid}= req.params
    if(!sid) throw new Error('Missing input!')

    const response = await Singer.findByIdAndDelete(sid)
    return res.status(200).json({
        success: response ? true : false,
        mess: response ?'Deleted Successfully!': 'Deleted failed!'
    })
})

const listSinger = asynHandler(async(req,res)=>{
    
    const response = await Singer.find()
    return res.status(200).json({
        success: response ? true : false,
        mess: response ?response: 'Deleted failed!'
    })
})


const userFollow = asynHandler(async(req,res)=>{
    const {_id} = req.user
    const {sid} = req.params
    if(!sid) throw new Error('Missing input')
    
    const singer = await Singer.findById(sid)
    const isRegisted = singer.userRegister.find((el)=> el.toString() === _id)
    
    if(isRegisted){
        const response = await Singer.findByIdAndUpdate(sid,{ $pull: { userRegister: _id }, $inc: { numberofregistrations:-1 } }, {new: true})
        return res.status(200).json({
            success: response?true: false,
            mess: response? response : 'Registed fail!'
        })
    }else{
        const response = await Singer.findByIdAndUpdate(sid,{ $push: { userRegister: _id } ,$inc: { numberofregistrations: 1 } }, {new: true})

        return res.status(200).json({
            success: response?true: false,
            mess: response? response : 'Registed fail!'
        })
    }
})


const addPlayListSinger = asynHandler(async(req,res)=>{
   
})
module.exports={
    createSinger,
    updateSinger,
    deleteSinger,
    listSinger,
    userFollow
}