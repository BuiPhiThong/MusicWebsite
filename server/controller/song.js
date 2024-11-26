const Song = require("../model/song");
const Singer = require("../model/singer");
const asynHandler = require("express-async-handler");
const { options } = require("../routes/song");


const createSong = asynHandler(async (req, res) => {
  const { songName, singerId } = req.body;
  if (!songName || !singerId) throw new Error("Missing input!");

  const response = await Song.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Create failed!",
  });
});

const updateSong = asynHandler(async (req, res) => {
  const { soid } = req.params;
  if(Object.keys(req.body).length===0) throw new Error('Missing input')

  const response = await Song.findByIdAndUpdate(soid, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Update failed!",
  });
});

const updateAudioPath = asynHandler(async (req, res) => {
  const { soid } = req.params;
  if (!soid) throw new Error("Missing input!");

  const oldData = await Song.findById(soid);

  const newData = {
    ...oldData._doc, //lấy tất cả dữ liệu từ bản ghi hiện tại
    ...req.body, //ghi đè các trường mới
    audioPaths: {
      ...oldData.audioPaths,
      ...req.body.audioPaths,
    },
  };
  const response = await Song.findByIdAndUpdate(soid, newData, { new: true });

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Update failed!",
  });
});

const incListMusic = asynHandler(async (req, res) => {
  const { soid } = req.params;
  if (!soid) throw new Error("Missing input!");

  const response = await Song.findByIdAndUpdate(soid, {$inc :{ listenCountSum: 1, listenCountWeek:1, listenCountMonth:1 }}, {new: true});
  return res.status(200).json({
    success: response? true: false,
    mess: response? response:'Song not found or update failed'
  })
});

const deleteSong = asynHandler(async (req, res) => {
  const { soid } = req.params;
  if (!soid) throw new Error("Missing input!");

  const response = await Song.findByIdAndDelete(soid);
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? "Deleted Successfully!" : "Deleted failed!",
  });
});

const listSong = asynHandler(async (req, res) => {
  const response = await Song.find();
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Deleted failed!",
  });
});


const listSongContribute = asynHandler(async(req,res)=>{
    const queries = {...req.query}

    //loại bỏ các trường không cần thiết
    const exclufields = ["limit","page","field","sort"]

    exclufields.forEach(el=> delete queries[el])

    let jsonQueries = JSON.stringify(queries)
    jsonQueries = jsonQueries.replace(/\b(gte|gt|lte|lt)\b/g,elMatches=> `$${elMatches}`)
    let formatQueries = JSON.parse(jsonQueries) //chuyển lại thành object
    
    if(queries.songName) {
      formatQueries.songName = {$regex: queries.songName, $options :'i'}
    }
   
    let sortedBy=''
    if(req.query.sort){
        sortedBy = req.query.sort.split(',').join(' ')
    }else{
      sortedBy='createdAt'
    }

    //tìm singer dựa trên singerName gửi lên để lấy được id ca sỹ
    let singerSearch=''
    if(req.query.singerName){
      singerSearch = {singerName: {$regex: req.query.singerName, $options: 'i'}} // *gán vào format query singerName
    }
    const singer = await Singer.find(singerSearch).select("_id")
    if(singer.length){
      formatQueries.singerId= {$in : singer.map(singer=> singer._id)} //*chuyển sang tìm song bằng singerId
      delete formatQueries.singerName; // Xóa trường singerName khỏi truy vấn
    }
    
    
    let queryCommand = Song.find(formatQueries).sort(sortedBy).populate('singerId','singerName') 

    
    if(req.query.field) {
      const field = req.query.field.split(',').join(' ')
      queryCommand =queryCommand.select(field)
    }
    //pagination
    const page =parseInt(req.query.page) || 1
    const limit =parseInt(req.query.limit) ||3
    const skip = (page -1)* limit

    queryCommand = queryCommand.skip(skip).limit(limit)

    const countData = await Song.countDocuments(formatQueries)
    const response = await queryCommand

    return res.status(200).json({
      success : response? true : false,
      countData: countData,
      page:page,
      limit:limit,
      mess: response? response:'Something went wrong!'
    })
     
})

const uploadImageSong = asynHandler(async(req,res)=>{
  const {soid} = req.params
  if(!req.file) throw new Error('Missing input!')

    const updateImg = req.file.path
   const response = await Song.findByIdAndUpdate(soid,{songImg: updateImg}, {new:true}) 

    return res.status(200).json({
      status: response? true : false,

      mess: response ? response : 'Update image Song failed!'
  })
})


module.exports = {
  createSong,
  updateSong,
  deleteSong,
  listSong,
  updateAudioPath,
  incListMusic,
  listSongContribute,
  uploadImageSong
};
