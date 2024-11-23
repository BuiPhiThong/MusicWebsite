const {default : mongoose } = require('mongoose')

const dbConnect = async ()=>{

    try {
        const conn= await  mongoose.connect(process.env.MONGODB_URI)

        if(conn.connection.readyState ===1){
            console.log('Conected Successfully');           
        }else
        console.log('Fail Conected');
        
    } catch (error) {
        console.log('DB Connected fail');
        throw new Error(error)
        
    }
}
module.exports = dbConnect