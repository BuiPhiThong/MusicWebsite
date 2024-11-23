const Song = require("../model/song");
const asynHandler = require("express-async-handler");

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
  if (!soid) throw new Error("Missing input!");

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
module.exports = {
  createSong,
  updateSong,
  deleteSong,
  listSong,
  updateAudioPath,
  incListMusic
};
