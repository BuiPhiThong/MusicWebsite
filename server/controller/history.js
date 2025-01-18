const History = require('../model/history')


const createHistory = async(req,res)=>{
    const {name ,songId,playlistId}= req.body
    const {_id} = req.user
    if(!name){
      return res.status(400).json({
        success:false,
        mess:`Missing input name`   
      })
    }
    const response = await History.create({userId:_id,name:name,songId:songId,playlistId:playlistId})

    if(!response){
        return res.status(409).json({
            success:false,
            mess:'Failed to create!'
        })
    }

    return res.status(201).json({
        success: true,
        mess:response
    })
}
module.exports={
    createHistory
}