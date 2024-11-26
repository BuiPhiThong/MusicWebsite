const Country = require('../model/country')
const asynHandler = require('express-async-handler')


const createCountry = asynHandler(async(req,res)=>{
    const {countryName}= req.body
    if(!countryName) throw new Error('Missing input!')

    const response = await Country.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        mess: response ? response: 'Create failed!'
    })
})
const updateCountry = asynHandler(async(req,res)=>{
    const {cid}= req.params
    if(Object.keys(req.body).length===0) throw new Error('Missing input')

    const response = await Country.findByIdAndUpdate(cid,req.body,{new:true})
    return res.status(200).json({
        success: response ? true : false,
        mess: response ? response: 'Update failed!'
    })
})
const deleteCountry = asynHandler(async(req,res)=>{
    const {cid}= req.params
    if(!cid) throw new Error('Missing input!')

    const response = await Country.findByIdAndDelete(cid)
    return res.status(200).json({
        success: response ? true : false,
        mess: response ?'Deleted Successfully!': 'Deleted failed!'
    })
})

const listCountries = asynHandler(async(req,res)=>{
    
    const response = await Country.find()
    return res.status(200).json({
        success: response ? true : false,
        mess: response ?response: 'Deleted failed!'
    })
})
module.exports={
    createCountry,
    updateCountry,
    deleteCountry,
    listCountries
}