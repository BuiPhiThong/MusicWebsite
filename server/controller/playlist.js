const PlayList = require("../model/playlist");
const Singer = require('../model/singer')
const PlaylistType = require("../model/playlistType");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const { default: slugify } = require("slugify");
const slugtify = require('slugify')
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  if (Object.keys(req.body).length === 0) throw new Error('Missing Input');
  if(name){
    req.body.slug= slugtify(name)
  }
  const response = await PlayList.create(req.body);

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : false,
  });
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { plid } = req.params;
  if (Object.keys(req.body).length === 0)
    throw new Error("Dont have data to update!");
  if(req.body.name){
    req.body.slug= slugtify(name)
  }
  const response = await PlayList.findByIdAndUpdate(plid, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : false,
  });
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { plid } = req.params;

  const response = await PlayList.findByIdAndDelete(plid);

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? "Deleted SuccessFully!" : false,
  });
});

const getPlaylist = asyncHandler(async (req, res) => {
  const response = await PlayList.find();

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : false,
  });
});

const addSongtoPlaylist = asyncHandler(async (req, res) => {
  const { plid } = req.params;
  const { songs } = req.body;

  const playlist = await PlayList.findById(plid);
  if (!playlist) throw new Error("Can not found playlist!");

  // Lọc các bài hát chưa có trong playlist
  const existingSongs = songs.filter((song) => playlist.songs.includes(song));
  const newSongs = songs.filter((song) => !playlist.songs.includes(song));

  // Nếu có bài hát trùng, gửi thông báo
  if (existingSongs.length > 0) {
    return res.status(400).json({
      success: false,
      message: `These songs already exist in the playlist: ${existingSongs.join(
        ", "
      )}`,
    });
  }

  // Nếu không có bài hát trùng, thêm các bài hát mới vào playlist
  if (newSongs.length > 0) {
    playlist.songs = [...playlist.songs, ...newSongs];
  }

  await playlist.save();

  const afterUpdate = await PlayList.findById(plid);

  return res.status(200).json({
    success: afterUpdate ? true : false,
    mess: afterUpdate ? afterUpdate : "Updated Fail",
  });
});

const getPlayListByTypeId = asyncHandler(async (req, res) => {
  const { tid } = req.params; // Lấy tid từ URL parameter

  try {
    // const count = await PlayList.countDocuments({ typePlaylist: tid });
    // console.log("Number of playlists found:", count);
    const objectIdTid = new mongoose.Types.ObjectId(tid); 
    const response = await PlayList.aggregate([
      { $match: { typePlaylist: objectIdTid, deleted: 0 } }, //giống where bên SQL
      { $sample: { size: 5 } }, 
      { $project: {name:1 , image:1 , songs: 1,slug:1}}, //giống bên SQL ở đầu câu query
      { $lookup: { from: "songs", localField: "songs", foreignField: "_id", as: "songs",// Join SQL " as " là giá trị trả ra
        
        pipeline:[{
            $project: { songName:1 }
        }]
     }}  
    ]);
    return res.status(200).json({
      success: response.length > 0,
      mess: response.length > 0 ? response : "No playlists found for this type",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      mess: "Something went wrong!",
    });
  }
});

const getPlaylistBySlug = asyncHandler(async(req,res)=>{
  const {slug} =req.params
  // console.log(slug);
  
  // const response = await PlayList.findOne({slug:slug}).populate('songs','songName')
  const response = await PlayList.findOne({ slug: slug })
  .populate({
    path: 'songs', // Populate danh sách bài hát
    select:'songName audioPaths songImg songLyrics',
    populate: {
      path: 'singerId',
      select: 'singerName', // Chỉ lấy các trường cần thiết
    },
  }).select('name views image');

  const lengthPlaylist= response.songs.length
  return res.status(200).json({
    success: response? true : false,
    data: response? response:'Can not found playlist',
    countSong:lengthPlaylist
  })
})

const updateSlugManyPlaylist = asyncHandler(async (req, res) => {
  const { plid } = req.body
  if(!plid || !Array.isArray(plid) || plid.length ===0){
    throw new Error('Missing Input')
  }
  const playlists =await PlayList.find({_id: {$in: plid}})

  const dataUpdate = playlists.map((data)=>{
    const slug = slugify(`${data.name}`)
    return {
      updateOne:{
        filter:{_id : data._id},
        update:{slug:slug}
      }
    }
  })
  const result = await PlayList.bulkWrite(dataUpdate)
  return res.status(200).json({
    success: result? true : false,
    data: result,
});
});
module.exports = {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getPlaylist,
  addSongtoPlaylist,
  getPlayListByTypeId,
  getPlaylistBySlug,
  updateSlugManyPlaylist
};
