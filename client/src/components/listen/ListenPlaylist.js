import React, { useState, useEffect, useRef } from "react";
import Navigation from "../navigation/Navigation";
import { FaCirclePlay, FaPause, FaRepeat } from "react-icons/fa6";
import { BsDownload } from "react-icons/bs";
import { MdAddCircleOutline } from "react-icons/md";
import { IoIosMore, IoMdClose, IoMdAdd } from "react-icons/io";
import { LuExternalLink } from "react-icons/lu";
import { RiHeartAddLine } from "react-icons/ri";
import { FaVolumeUp } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap"; // Import Modal từ react-bootstrap
import "./listenplaylist.css";
import { useParams } from "react-router-dom";
import { apiGetListenSong } from "../../apis/listen";
import { useDispatch, useSelector } from "react-redux";
import listenPlaylistReducer, {
  fetchDataListenPlaylist,
} from "../../reducers/listenPlaylistSlice";

const ListenPlaylist = () => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const {
    isPlaying,
    songProgress,
    volume,
    currentTime,
    duration,
    savedTime,
    showMusicPlayer,
    playlistData,
    currentSongIndex,
    isLoading,
    error,
  } = useSelector((state) => state.listenPlaylist);

  // const audioUrl =
  //   "https://vnno-zn-5-tf-a128-z3.zmdcdn.me/15dc8004b277efefbe166fd820472b9e?authen=exp=1734339436~acl=/15dc8004b277efefbe166fd820472b9e*~hmac=11c2abde2f0232dedaa32ca63aaf15a5";

  const { slug } = useParams();
  // const [data, setData] = useState([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const dataFetch = await apiGetListenSong(slug);
  //     setData(dataFetch);
  //   };
  //   fetchData();
  // }, []);
  useEffect(() => {
    dispatch(fetchDataListenPlaylist(slug));
  }, [dispatch, slug]);
  const currentSong = playlistData?.songs?.[currentSongIndex];

  useEffect(() => {
    if (audioRef.current && currentSong) {
      // Lấy đường dẫn nhạc từ data và set vào audioRef
      audioRef.current.src = currentSong.audioPaths.normal; // Hoặc audioPaths.vip nếu bạn muốn chất lượng cao
      audioRef.current.play();
    }
  }, [currentSong]);
  console.log(playlistData);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        dispatch(listenPlaylistReducer.actions.togglePlay(false));
      } else {
        audioRef.current.play();
        dispatch(listenPlaylistReducer.actions.togglePlay(true));
      }
    }
  };

  const updateProgress = () => {
    if (audioRef.current) {
      // Kiểm tra nếu audioRef.current tồn tại
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      const progress = (current / total) * 100;
      dispatch(listenPlaylistReducer.actions.setSongProgress(progress));
      dispatch(listenPlaylistReducer.actions.setCurrentTime(current));
    }
  };

  // Thực hiện cập nhật tiến độ mỗi giây
  useEffect(() => {
    if (isPlaying && showMusicPlayer) {
      // Chỉ chạy khi đang phát nhạc và modal mở
      const interval = setInterval(updateProgress, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, showMusicPlayer]); // Khi tắt modal (setShowMusicPlayer = false), interval sẽ được clear

  const closeModal = () => {
    // Lưu thời gian hiện tại vào savedTime
    dispatch(listenPlaylistReducer.actions.setSavedTime(currentTime));
    // Đóng modal
    dispatch(listenPlaylistReducer.actions.toggleMusicPlayer(false));
    // Dừng nhạc khi đóng modal
    if (audioRef.current) {
      audioRef.current.pause();
      // Đảm bảo cập nhật trạng thái isPlaying về false khi đóng modal
      dispatch(listenPlaylistReducer.actions.togglePlay(false));
    }
  };

  const handleVolumeChange = (e) => {
    dispatch(listenPlaylistReducer.actions.setVolume(e.target.value));

    audioRef.current.volume = e.target.value / 100; // Điều chỉnh âm lượng của thẻ audio
  };

  // Hàm định dạng thời gian (mm:ss)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // Hàm cập nhật thời gian khi kéo thanh tiến độ
  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration; // Tính toán thời gian từ giá trị của thanh tiến độ
    audioRef.current.currentTime = seekTime; // Cập nhật vị trí của bài hát
    // setSongProgress(e.target.value); // Cập nhật tiến độ thanh slider
    dispatch(listenPlaylistReducer.actions.setSongProgress(e.target.value));
  };
  const handleSongSelect = (index, song) => {
    dispatch(listenPlaylistReducer.actions.setCurrentSongIndex(index));
    const selectedAudioUrl = song.audioPaths.normal; // Hoặc song.audioPaths.vip nếu cần
    dispatch(listenPlaylistReducer.actions.setAudioUrl(selectedAudioUrl));

    dispatch(listenPlaylistReducer.actions.togglePlay(true));
  };

  return (
    <div className="container">
      <Navigation />
      <hr style={{ margin: "0px" }} />
      <div className="row mt-3">
        <div className="col-md-9 border menu_left">
          <div className="row border">
            <div className="col-md-12 scrren_playlist">
              <div className="image_playlist">
                <img
                  src="https://avatar-ex-swe.nixcdn.com/playlist/2024/10/24/c/4/3/d/1729764086809_300.jpg"
                  alt=""
                />
              </div>
              <div className="info_playlist">
                <h1 className="title_playlist">{playlistData?.name}</h1>
                <div>Various Singer</div>
                <div>{playlistData?.countSong} Bài hát, about 3hr</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 coltrol_bar">
              <FaCirclePlay
                fontSize="60px"
                className="mt-3 mb-3"
                onClick={() =>
                  dispatch(
                    listenPlaylistReducer.actions.toggleMusicPlayer(true)
                  )
                }
              />

              <MdAddCircleOutline fontSize="40px" className="mx-3 mt-2" />
              <IoIosMore fontSize="30px" />
            </div>
          </div>
          <div className="row mx-1">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Song</th>
                    <th scope="col">Singer</th>
                    <th scope="col">Handle</th>
                  </tr>
                </thead>
                <tbody>
                  {playlistData?.songs?.map((song, index) => (
                    <tr
                      key={index}
                      onClick={() => handleSongSelect(index, song)}
                      className="song-row"
                    >
                      <th scope="row">{index + 1}</th>
                      <td>{song?.songName}</td>
                      {song?.singerId?.map((el, index) => (
                        <td>{el?.singerName}</td>
                      ))}

                      <td>
                        <RiHeartAddLine fontSize="18px" />
                        <BsDownload className="mx-2" />
                        <LuExternalLink className="mx-1" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-3 border menu_right">
          <div className="lyric">Lyric</div>
        </div>
      </div>

      {/* Music Player Modal */}
      {/* {showMusicPlayer && (
        <div className="music-modal">
          <div className="close-btn" onClick={closeModal}>
            <IoMdClose />
          </div>
          <div className="song-info">
            <img
              src="https://avatar-ex-swe.nixcdn.com/playlist/2024/10/24/c/4/3/d/1729764086809_300.jpg"
              alt="Song"
            />
            <div>
              <h5>Daily mix 2</h5>
              <p>Justin Bieber</p>
            </div>
          </div>

          <div className="controls">
            {isPlaying ? (
              <FaPause onClick={handlePlayPause} />
            ) : (
              <FaCirclePlay onClick={handlePlayPause} />
            )}

            <div className="volume-control">
              <FaVolumeUp className="volume-icon" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
          </div>

          <div className="song-time mx-2">
            <span>
              {formatTime(currentTime)}/{formatTime(duration)}
            </span>
          </div>

          <div className="progress-bar">
            <input
              type="range"
              min="0"
              max="100"
              value={songProgress}
              onChange={handleSeek}
              className="progress-slider"
            />
          </div>

          <audio
            ref={audioRef}
            src={audioUrl}
            preload="auto"
            onLoadedMetadata={() => {
              dispatch(
                listenPlaylistReducer.actions.setDuration(
                  audioRef.current.duration
                )
              );
              audioRef.current.currentTime = savedTime; // Nếu mở lại thì phát từ savedTime
            }}
            onTimeUpdate={updateProgress} // Cập nhật tiến độ khi phát nhạc
          />
        </div>
      )} */}

      {showMusicPlayer && (
        <div className="music-modal">
          <div className="close-btn" onClick={closeModal}>
            <IoMdClose />
          </div>
          <div className="song-info">
          <img
        src={playlistData?.songs[currentSongIndex]?.songImg || "https://stc-id.nixcdn.com/v11/images/avatar_default.jpg"}
        alt="Song"
      />
      <div>
        {/* Hiển thị tên bài hát và tên ca sĩ của bài hát đang phát */}
        <h5>{playlistData?.songs[currentSongIndex]?.songName}</h5> {/* Tên bài hát */}
        <p>
          {playlistData?.songs[currentSongIndex]?.singerId?.map((singer, idx) => (
            <span key={idx}>{singer.singerName}{idx < playlistData.songs[currentSongIndex].singerId.length - 1 ? ", " : ""}</span>
          ))}
        </p> {/* Ca sĩ */}
      </div>
          </div>

          <div className="controls">
            {isPlaying ? (
              <FaPause onClick={handlePlayPause} />
            ) : (
              <FaCirclePlay onClick={handlePlayPause} />
            )}

            <div className="volume-control">
              <FaVolumeUp className="volume-icon" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
          </div>

          <div className="song-time mx-2">
            <span>
              {formatTime(currentTime)}/{formatTime(duration)}
            </span>
          </div>

          <div className="progress-bar">
            <input
              type="range"
              min="0"
              max="100"
              value={songProgress}
              onChange={handleSeek}
              className="progress-slider"
            />
          </div>

          <audio
            ref={audioRef}
            src={playlistData?.songs[currentSongIndex]?.audioPaths?.normal}
            preload="auto"
            onLoadedMetadata={() => {
              dispatch(
                listenPlaylistReducer.actions.setDuration(
                  audioRef.current.duration
                )
              );
              audioRef.current.currentTime = savedTime; // Nếu mở lại thì phát từ savedTime
            }}
            onTimeUpdate={updateProgress} // Cập nhật tiến độ khi phát nhạc
            onEnded={() => {
              // Tự động chuyển sang bài tiếp theo khi bài hát kết thúc
              if (currentSongIndex < playlistData?.songs.length - 1) {
                dispatch(
                  listenPlaylistReducer.actions.setCurrentSongIndex(
                    currentSongIndex + 1
                  )
                );
              } else {
                dispatch(listenPlaylistReducer.actions.setCurrentSongIndex(0));
              }

              // Đảm bảo phát nhạc ngay sau khi chuyển bài
              dispatch(listenPlaylistReducer.actions.togglePlay(true));
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ListenPlaylist;
