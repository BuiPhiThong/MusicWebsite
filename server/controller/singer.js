const Singer = require("../model/singer");
const asynHandler = require("express-async-handler");

const createSinger = asynHandler(async (req, res) => {
  const { singerName, national } = req.body;
  if (!singerName || !national) throw new Error("Missing input!");

  const response = await Singer.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Create failed!",
  });
});
const createPlayListSinger = asynHandler(async (req, res) => {
  const { sid } = req.params;
  const { name, description, songs } = req.body;
  const singer = await Singer.findById(sid);

  if (!singer) throw new Error("Not found Singer");
  const existNamePlaylist = singer.playlist.find((playlist)=> playlist.name === name)
  if(existNamePlaylist){
    throw new Error('Exited Name Playlist')
  }
  const result = await Singer.updateOne(
    { _id: sid },
    { $push: { playlist: { name, description, songs } } },
    { new: true }
  );
  if (result.nModified === 0){
    throw new Error('Failed to create playlist!') // là
  }
  
  const afterSinger = await Singer.findById(sid);
  return res.status(200).json({
    success: true,
    afterSinger,
  });
});

const updatePlayListSinger = asynHandler(async (req, res) => {
  const { sid } = req.params;
  const { plid, songs, name, description } = req.body;

  const singer = await Singer.findById(sid);

  let currentPlaylist = singer.playlist.find((el) => el._id.toString() === plid);
  if (!currentPlaylist) throw new Error(`Can't not found playlist`);

  if (name) currentPlaylist.name = name;
  if (description) currentPlaylist.description = description;

  const existSongs = songs.filter(song=> currentPlaylist.songs.includes(song))
  const newSongs = songs.filter(song=> !currentPlaylist.songs.includes(song))

  if(existSongs.length >0){
    return res.status(400).json({
      success: false,
      message: `These songs already exist in the playlist: ${existSongs.join(', ')}`
  });
  }
  if(newSongs.length>0){
    currentPlaylist.songs = [...currentPlaylist.songs,...newSongs];//* ghép hai mảng /1 là đang có sẵn /2 là gửi từ cilent lên
  }
  
  await singer.save();

  const afterUpdate = singer.playlist.find((el) => el._id.toString() === plid);
  return res.status(200).json({
    success: true,
    message: "Playlist updated successfully!",
    data: afterUpdate,
  });
});

const updateSinger = asynHandler(async (req, res) => {
  const { sid } = req.params;
  if(Object.keys(req.body).length===0) throw new Error('Missing input')

  const response = await Singer.findByIdAndUpdate(sid, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Update failed!",
  });
});
const deleteSinger = asynHandler(async (req, res) => {
  const { sid } = req.params;
  if (!sid) throw new Error("Missing input!");

  const response = await Singer.findByIdAndDelete(sid);
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? "Deleted Successfully!" : "Deleted failed!",
  });
});

const listSinger = asynHandler(async (req, res) => {
  const response = await Singer.find();
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Deleted failed!",
  });
});

const userFollow = asynHandler(async (req, res) => {
  const { _id } = req.user;
  const { sid } = req.params;
  if (!sid) throw new Error("Missing input");

  const singer = await Singer.findById(sid);
  const isRegisted = singer.userRegister.find((el) => el.toString() === _id);

  if (isRegisted) {
    const response = await Singer.findByIdAndUpdate(
      sid,
      { $pull: { userRegister: _id }, $inc: { numberofregistrations: -1 } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mess: response ? response : "Registed fail!",
    });
  } else {
    const response = await Singer.findByIdAndUpdate(
      sid,
      { $push: { userRegister: _id }, $inc: { numberofregistrations: 1 } },
      { new: true }
    );

    return res.status(200).json({
      success: response ? true : false,
      mess: response ? response : "Registed fail!",
    });
  }
});

const searchPlaylist = asynHandler(async(req,res)=>{
  
})


module.exports = {
  createSinger,
  updateSinger,
  deleteSinger,
  listSinger,
  userFollow,
  updatePlayListSinger,
  createPlayListSinger,
};
