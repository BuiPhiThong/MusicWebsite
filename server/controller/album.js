const Album = require('../model/album')
const asynHandler = require('express-async-handler')


const createAlbum = asynHandler(async(req,res)=>{
    const {albumName,paticipateSingerId,songs,releaseDate}= req.body
    if(!albumName|| !paticipateSingerId|| !songs || !releaseDate) throw new Error('Missing input!')

    const response = await Album.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        mess: response ? response: 'Create failed!'
    })
})
const updateAlbum = asynHandler(async(req,res)=>{
    const {aid}= req.params
    if(Object.keys(req.body).length===0) throw new Error('Missing input')

    const response = await Album.findByIdAndUpdate(aid,req.body,{new:true})

    return res.status(200).json({
        success: response ? true : false,
        mess: response ? response: 'Update failed!'
    })
})
const deleteAlbum = asynHandler(async(req,res)=>{
    const {aid}= req.params
    if(!aid) throw new Error('Missing input!')

    const response = await Album.findByIdAndDelete(aid)
    return res.status(200).json({
        success: response ? true : false,
        mess: response ?'Deleted Successfully!': 'Deleted failed!'
    })
})

const listAlbum = asynHandler(async(req,res)=>{
    
    const response = await Album.find()
    return res.status(200).json({
        success: response ? true : false,
        mess: response ?response: 'Deleted failed!'
    })
})
module.exports={
    createAlbum,
    updateAlbum,
    deleteAlbum,
    listAlbum
}