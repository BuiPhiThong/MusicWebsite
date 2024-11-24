const MusicType = require('../model/musicType')
const asynHandler = require('express-async-handler')


const createMusicType = asynHandler(async(req,res)=>{
    const {musicTypeName}= req.body
    // console.log(musicTypeName);
    
    if(!musicTypeName) throw new Error('Missing input!')

    const response = await MusicType.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        mess: response ? response: 'Create failed!'
    })
})



const updateMusicType = asynHandler(async(req,res)=>{
    const {mtid}= req.params
    console.log(mtid);
    
    if(!mtid) throw new Error('Missing input!')

    const response = await MusicType.findByIdAndUpdate(mtid,req.body,{new:true})
    return res.status(200).json({
        success: response ? true : false,
        mess: response ? response: 'Update failed!'
    })
})
const deleteMusicType= asynHandler(async(req,res)=>{
    const {mtid}= req.params
    if(!mtid) throw new Error('Missing input!')

    const response = await MusicType.findByIdAndDelete(mtid)
    return res.status(200).json({
        success: response ? true : false,
        mess: response ?'Deleted Successfully!': 'Deleted failed!'
    })
})

const listMusicType = asynHandler(async(req,res)=>{
    
    const response = await MusicType.find()
    return res.status(200).json({
        success: response ? true : false,
        mess: response ?response: 'Deleted failed!'
    })
})
module.exports={
    createMusicType,
    updateMusicType,
    deleteMusicType,
    listMusicType
}