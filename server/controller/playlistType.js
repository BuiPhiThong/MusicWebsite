const PlaylistType = require('../model/playlistType')
const asynHandler = require('express-async-handler')


const createTypePLaylist = asynHandler(async(req,res)=>{
    const {name}= req.body
    if(!name) throw new Error('Missing input!')

    const response = await PlaylistType.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        mess: response ? response: 'Create failed!'
    })
})
const updateTypePlaylist = asynHandler(async(req,res)=>{
    const {ltid}= req.params
    if(Object.keys(req.body).length===0) throw new Error('Missing input')

    const response = await PlaylistType.findByIdAndUpdate(ltid,req.body,{new:true})
    return res.status(200).json({
        success: response ? true : false,
        mess: response ? response: 'Update failed!'
    })
})
const deleteTypePlaylist = asynHandler(async(req,res)=>{
    const {ltid}= req.params
    if(!ltid) throw new Error('Missing input!')

    const response = await PlaylistType.findByIdAndDelete(ltid)
    return res.status(200).json({
        success: response ? true : false,
        mess: response ?'Deleted Successfully!': 'Deleted failed!'
    })
})

const listTypePlaylist = asynHandler(async(req,res)=>{
    
    const response = await PlaylistType.find()
    return res.status(200).json({
        success: response ? true : false,
        mess: response ?response: 'Deleted failed!'
    })
})
module.exports={
    createTypePLaylist,
    updateTypePlaylist,
    deleteTypePlaylist,
    listTypePlaylist
}