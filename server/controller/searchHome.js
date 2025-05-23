const Song = require("../model/song");
const Singer = require("../model/singer");
const Playlist = require("../model/playlist");
const diacritics = require("diacritics");
const asynHandler = require("express-async-handler");

const searchHome = asynHandler(async (req, res) => {
  const { all } = req.query;

  let allSearch = {};
  if (all) {
    allSearch = { $regex: all, $options: "i" };
  }
  try {
    // Tìm kiếm bài hát
    let dataSongAll = [];
    let dataplaylistAll = [];
    let dataPlaylistSingerAll = [];
    let countDataSongAll = 0;
    let countDataPlaylistAll = 0;
    let countDataPlaylistSingerAll = 0;
    if (all) {
      // dataSongAll = await Song.find({ songName: allSearch  , deleted: 0 }).select('songName songImg').populate('singerId', 'singerName').limit(8);

      const singers = await Singer.find({
        singerName: allSearch,
        deleted: 0,
      }).select("_id"); // Chỉ lấy trường _id của ca sĩ

      const singerIds = singers.map((singer) => singer._id); // Lấy danh sách _id của các ca sĩ

      // Tìm các bài hát có singerId nằm trong danh sách các ca sĩ đã tìm được
      const dataSongAll = await Song.find({
        $or: [{ singerId: { $in: singerIds } }, { songName: allSearch }],
        deleted: 0,
      })
        .select("songName songImg")
        .populate("singerId", "singerName")
        .limit(5);

      countDataSongAll = await Song.countDocuments({
        $or: [{ singerId: { $in: singerIds } }, { songName: allSearch }],
        deleted: 0,
      });

      //playlist
      dataplaylistAll = await Playlist.find({ name: allSearch, deleted: 0 })
        .select("name image")
        .limit(7);
      countDataPlaylistAll = await Playlist.countDocuments({
        name: allSearch,
        deleted: 0,
      });

      dataPlaylistSingerAll = await Singer.find({
        "playlist.name": { $regex: all, $options: "i" },
        deleted: 0,
      })
        .populate("playlist.songs", "songName")
        .select("playlist.name playlist.image");
        
      countDataPlaylistSingerAll = await Singer.countDocuments({
        "playlist.name": { $regex: all, $options: "i" },
        deleted: 0,
      });
      // const result = dataPlaylistSingerAll.map((singer) => {
      //   const matchedPlaylists = singer.playlist.filter((playlist) =>
      //     playlist.name.toLowerCase().includes(all.toLowerCase())
      //   );
      //   return {
      //     playlists: matchedPlaylists,
      //   };
      // });
      const result = dataPlaylistSingerAll.map(el=>el.playlist).flat()
      // console.log(result);
      
      const playlistAll = [...dataplaylistAll, ...result];
      const countplaylistAll = playlistAll.length;
      return res.status(200).json({
        data: {
          countDataSongAll,
          countDataPlaylistAll,
          countDataPlaylistSingerAll,
          dataSongAll,
          dataplaylistAll,
          dataPlaylistSingerAll: result,
          countplaylistAll,
          playlistAll,
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      mess: "Server error",
      error: error.message,
    });
  }
});

const searchHome1 = asynHandler(async (req, res) => {
  const queries = { ...req.query };
  if (!queries.song) throw new Error("Query param is /?song");

  // const removeFields=["limit","page","field","sort"]
  // removeFields.forEach((el)=> delete queries[el])

  let songSearch = "";
  if (queries.song) {
    songSearch = { $regex: queries.song, $options: "i" };
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  try {
    // Tìm kiếm bài hát

    let dataSongSearch = [];
    let count = 0;
    const singer = await Singer.find({
      singerName: songSearch,
      deleted: 0,
    }).select("_id");
    const singerIds = singer.map((el) => el._id);    
    if (queries.song) {
      dataSongSearch = await Song.find({
        $or: [{ songName: songSearch }, { singerId: { $in: singerIds } }],
        deleted: 0,
      })
        .populate("singerId", "singerName")
        .select("songName songImg")
        .skip(skip)
        .limit(limit);

      count = await Song.countDocuments({
        $or: [{ songName: songSearch }, { singerId: { $in: singerIds } }],
        deleted: 0,
      });
      const totalPage = Math.ceil(count / limit);
      return res.status(200).json({
        data: {
          count: count,
          page,
          totalPage,
          limit,
          skip,
          dataSongSearch,
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      mess: "Server error",
      error: error.message,
    });
  }
});

// const searchHome2 = asynHandler(async (req, res) => {
//     const { singer } = req.query;
//     if(!singer) throw new Error('Query param is /?singer')

//     let singerSearch=''
//     if(singer){
//         singerSearch ={$regex: '.*' + singer + '.*', $options:'i'}
//     }
//     try {
//         // Tìm kiếm bài hát
//         let dataSingerSearch=[]
//         if(singer){
//             dataSingerSearch= await Singer.find({singerName: singerSearch}).select('singerName  singerImg')
//             count = await Singer.countDocuments({singerName: singerSearch})
//             return res.status(200).json({
//                 data: {
//                     count:count,
//                     dataSingerSearch
//                 },
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             mess: 'Server error',
//             error: error.message,
//         });
//     }
// });
const searchHome2 = asynHandler(async (req, res) => {
  const { singer } = req.query;
  if (!singer) throw new Error("Query param is /?singer");

  let singerSearch = "";
  if (singer) {
    singerSearch = { $regex: ".*" + singer + ".*", $options: "i" };
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;

  try {
    // Tìm kiếm ca sĩ
    const dataSingerSearch = await Singer.find({ singerName: singerSearch })
      .select("singerName singerImg")
      .skip(skip)
      .limit(limit);
    const count = await Singer.countDocuments({ singerName: singerSearch });
    const totalPage = Math.ceil(count / limit);

    return res.status(200).json({
      data: {
        count,
        page,
        totalPage,
        limit,
        skip,
        dataSingerSearch,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      mess: "Server error",
      error: error.message,
    });
  }
});

// const searchHome3 = asynHandler(async (req, res) => {
//     const { playlist } = req.query;
//     if(!playlist) throw new Error('Query param is /?playlist')

//     let playlistSearch=''

//     if(playlist){
//         playlistSearch ={$regex: '.*' + playlist + '.*', $options:'i'}
//     }
//     try {
//         // Tìm kiếm bài hát

//         let dataPlaylistSearch=[]
//         if(playlist){
//             dataPlaylistSearch= await Playlist.find({name: playlistSearch}).select('name image').limit(30)
//             count = await Playlist.countDocuments({name: playlistSearch})
//             return res.status(200).json({
//                 data: {
//                     count:count,
//                     dataPlaylistSearch
//                 },
//             });
//         }
//         let dataSingerSearch=[]
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             mess: 'Server error',
//             error: error.message,
//         });
//     }
// });
const searchHome3 = asynHandler(async (req, res) => {
  const { playlist } = req.query;
  if (!playlist) throw new Error("Query param is /?playlist");

  let playlistSearch = "";
  if (playlist) {
    playlistSearch = { $regex: ".*" + playlist + ".*", $options: "i" };
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;

  try {
    // Tìm kiếm playlist
    const dataPlaylistSearch = await Playlist.find({ name: playlistSearch })
      .select("name image")
      .skip(skip)
      .limit(limit);
    const count = await Playlist.countDocuments({ name: playlistSearch });
    const totalPage = Math.ceil(count / limit);

    return res.status(200).json({
      data: {
        count,
        page,
        totalPage,
        limit,
        skip,
        dataPlaylistSearch,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      mess: "Server error",
      error: error.message,
    });
  }
});

module.exports = {
  searchHome,
  searchHome1,
  searchHome2,
  searchHome3,
};
