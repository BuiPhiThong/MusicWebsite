const Song = require("../model/song");
const Singer = require("../model/singer");
const PlayList = require("../model/playlist");
const asynHandler = require("express-async-handler");
const { options } = require("../routes/song");
const mongoose = require("mongoose");

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
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");

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

  const response = await Song.findByIdAndUpdate(
    soid,
    { $inc: { listenCountSum: 1, listenCountWeek: 1, listenCountMonth: 1 } },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Song not found or update failed",
  });
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

const listSongContribute = asynHandler(async (req, res) => {
  const queries = { ...req.query };

  //loại bỏ các trường không cần thiết
  const exclufields = ["limit", "page", "field", "sort"];

  exclufields.forEach((el) => delete queries[el]);

  let jsonQueries = JSON.stringify(queries);
  jsonQueries = jsonQueries.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (elMatches) => `$${elMatches}`
  );
  let formatQueries = JSON.parse(jsonQueries); //chuyển lại thành object

  if (queries.songName) {
    formatQueries.songName = { $regex: queries.songName, $options: "i" };
  }

  let sortedBy = "";
  if (req.query.sort) {
    sortedBy = req.query.sort.split(",").join(" ");
  } else {
    sortedBy = "createdAt";
  }
  //tìm singer dựa trên singerName gửi lên để lấy được id ca sỹ
  let singerSearch = "";
  if (req.query.singerName) {
    singerSearch = {
      singerName: { $regex: req.query.singerName, $options: "i" },
    }; // *gán vào format query singerName
  }
  const singer = await Singer.find(singerSearch).select("_id");
  if (singer.length) {
    formatQueries.singerId = { $in: singer.map((singer) => singer._id) }; //*chuyển sang tìm song bằng singerId
    delete formatQueries.singerName; // Xóa trường singerName khỏi truy vấn
  }

  let queryCommand = Song.find(formatQueries)
    .sort(sortedBy)
    .populate("singerId", "singerName");

  if (req.query.field) {
    const field = req.query.field.split(",").join(" ");
    queryCommand = queryCommand.select(field);
  }
  //pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const skip = (page - 1) * limit;

  queryCommand = queryCommand.skip(skip).limit(limit);

  const countData = await Song.countDocuments(formatQueries);
  const response = await queryCommand;

  return res.status(200).json({
    success: response ? true : false,
    countData: countData,
    page: page,
    limit: limit,
    mess: response ? response : "Something went wrong!",
  });
});

const searchHome = asynHandler(async (req, res) => {
  const { textSearch } = req.query;

  let songSearch = {};
  let singerSearch = {};
  let playlistSearch = {};

  // Nếu textSearch không có giá trị, trả về kết quả trống
  if (textSearch) {
    songSearch = { $regex: textSearch, $options: "i" };
    singerSearch = { $regex: textSearch, $options: "i" };
    playlistSearch = { $regex: textSearch, $options: "i" };
  }

  try {
    const rsSong = await Song.aggregate([
      { $match: { songName: songSearch, deleted: 0 } },
      { $sort: { listenCountSum: -1 } },
      { $project: { songName: 1 } },
      { $limit: 3 },
    ]);

    const rsSinger = await Singer.find({ singerName: singerSearch, deleted: 0 })
      .select("singerName")
      .limit(3);

    const rsPlaylist = await PlayList.aggregate([
      { $match: { name: playlistSearch, deleted: 0 } },
      { $sort: { views: -1 } },
      { $project: { name: 1 } },
      { $limit: 3 },
    ]);

    return res.status(200).json({
      success: true,
      dataPopup: {
        songs: rsSong,
        singers: rsSinger,
        playlists: rsPlaylist,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


const uploadImageSong = asynHandler(async (req, res) => {
  const { soid } = req.params;
  if (!req.file) throw new Error("Missing input!");

  const updateImg = req.file.path;
  const response = await Song.findByIdAndUpdate(
    soid,
    { songImg: updateImg },
    { new: true }
  );

  return res.status(200).json({
    status: response ? true : false,

    mess: response ? response : "Update image Song failed!",
  });
});

// const getTop10SongByIdC= asynHandler(async(req,res)=>{
//   const {cid} = req.params
//   const objectIdC = new mongoose.Types.ObjectId(cid)
//   const response = await Song.aggregate([
//     { $match : { countryId: objectIdC, deleted : 0 } },
//     {$sort : { listenCountWeek : -1 , createdAt: -1} },
//     { $limit : 10 },
//     { $project : {
//       songName: 1,
//       singerId:1,
//       musictypeId:1,
//       countryId: 1,
//       songImg:1,
//       listenCountWeek:1
//     } }
//   ])

//   return res.status(200).json({
//     success: response? true : false,
//     mess: response? response : 'Can not get top 10 by country!!'
//   })
// })

const getTop1SongByIdC = asynHandler(async (req, res) => {
  const { cid } = req.params;
  const objectIdC = new mongoose.Types.ObjectId(cid);

  const response = await Song.aggregate([
    { $match: { countryId: objectIdC, deleted: 0 } },
    { $sort: { listenCountWeek: -1, createdAt: -1 } },
    { $limit: 1 },
    {
      $project: {
        songName: 1,
        singerId: 1,
        musictypeId: 1,
        countryId: 1,
        songImg: 1,
        listenCountWeek: 1,
      },
    },
    {
      $lookup: {
        from: "singers",
        localField: "singerId",
        foreignField: "_id",
        as: "singers",

        pipeline: [
          {
            $project: { singerName: 1 },
          },
        ],
      },
    },
  ]);

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Can not get top 1 by country!!",
  });
});

const getTop2SongByIdC = asynHandler(async (req, res) => {
  const { cid } = req.params;
  const objectIdC = new mongoose.Types.ObjectId(cid);

  const response = await Song.aggregate([
    { $match: { countryId: objectIdC, deleted: 0 } },
    { $sort: { listenCountWeek: -1, createdAt: -1 } },
    { $skip: 1 }, // Skip the first result
    { $limit: 1 },
    {
      $project: {
        songName: 1,
        singerId: 1,
        musictypeId: 1,
        countryId: 1,
        songImg: 1,
        listenCountWeek: 1,
      },
    },
    {
      $lookup: {
        from: "singers",
        localField: "singerId",
        foreignField: "_id",
        as: "singers",

        pipeline: [
          {
            $project: { singerName: 1 },
          },
        ],
      },
    },
  ]);

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Can not get top 2 by country!!",
  });
});

const getTop3SongByIdC = asynHandler(async (req, res) => {
  const { cid } = req.params;
  const objectIdC = new mongoose.Types.ObjectId(cid);

  const response = await Song.aggregate([
    { $match: { countryId: objectIdC, deleted: 0 } },
    { $sort: { listenCountWeek: -1, createdAt: -1 } },
    { $skip: 2 }, // Skip the first two results
    { $limit: 1 },
    {
      $project: {
        songName: 1,
        singerId: 1,
        musictypeId: 1,
        countryId: 1,
        songImg: 1,
        listenCountWeek: 1,
      },
    },
    {
      $lookup: {
        from: "singers",
        localField: "singerId",
        foreignField: "_id",
        as: "singers",

        pipeline: [
          {
            $project: { singerName: 1 },
          },
        ],
      },
    },
  ]);

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Can not get top 3 by country!!",
  });
});

const getTop4To10SongByIdC = asynHandler(async (req, res) => {
  const { cid } = req.params;
  const objectIdC = new mongoose.Types.ObjectId(cid);

  const response = await Song.aggregate([
    { $match: { countryId: objectIdC, deleted: 0 } },
    { $sort: { listenCountWeek: -1, createdAt: -1 } },
    { $skip: 3 }, // Skip the first three results
    { $limit: 7 }, // Get results from 4 to 10
    {
      $project: {
        songName: 1,
        singerId: 1,
        musictypeId: 1,
        countryId: 1,
        songImg: 1,
        listenCountWeek: 1,
      },
    },
    {
      $lookup: {
        from: "singers",
        localField: "singerId",
        foreignField: "_id",
        as: "singers",

        pipeline: [
          {
            $project: { singerName: 1 },
          },
        ],
      },
    },
  ]);

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Can not get top 4 to 10 by country!!",
  });
});

module.exports = {
  createSong,
  updateSong,
  deleteSong,
  listSong,
  updateAudioPath,
  incListMusic,
  listSongContribute,
  uploadImageSong,
  getTop1SongByIdC,
  getTop2SongByIdC,
  getTop3SongByIdC,
  getTop4To10SongByIdC,
  searchHome,
};
