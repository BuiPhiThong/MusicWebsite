const express = require('express');
require('dotenv').config();
const dbConnect = require('./config/dbconnect')
 const initRoutes = require('./routes/index')
 const cookieParser = require('cookie-parser')
const cors = require('cors')
require('./passport')

const app = express();

const port = process.env.PORT || 8888;
app.use(cors({
    origin:process.env.URL_CLIENT,
    methods:['POST','PUT','GET','DELETE'],
    credentials:true  // Cho phép gửi và nhận cookies
}))
app.use(express.json());// đọc hiểu data json của cilent gửi lên
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
dbConnect()


initRoutes(app)
// app.use('/',(req,res)=>{
//     res.send('Server on')
// })
app.listen(port, () => {
    console.log('Server running on the port ' + port);
});
