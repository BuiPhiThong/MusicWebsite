import React, { useState, useEffect, useRef } from "react";
import Navigation from "../navigation/Navigation";
import { FaCirclePlay, FaPause } from "react-icons/fa6";
import { BsDownload } from "react-icons/bs";
import { MdAddCircleOutline } from "react-icons/md";
import { IoIosMore, IoMdClose, IoMdAdd } from "react-icons/io";
import { LuExternalLink } from "react-icons/lu";
import { RiHeartAddLine } from "react-icons/ri";
import { FaVolumeUp } from "react-icons/fa";
import "./listenplaylist.css";
import { data, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import listenPlaylistReducer, {
  fetchDataListenPlaylist,
} from "../../reducers/listenPlaylistSlice";
import { fetchCurrentPlaylist } from "../../reducers/actionUser";
import {
  apiCreateWishList,
  apiSaveAPlaylist,
  apiSaveAPlaylist2,
  apiUpandReWishList,
} from "../../apis/user";
import { toast } from "react-toastify"; // Import toast từ react-toastify
import { useForm } from "react-hook-form";
import { Tooltip } from "antd";
const ListenPlaylist = () => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isNewPlaylistPopupVisible, setNewPlaylistPopupVisible] =
    useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [currentSelectedSong, setCurrentSelectedSong] = useState(null); // Lưu bài hát hiện tại
  const [formAddplaylist, setFormAddPlaylist] = useState({
    name: "",
    displayMode: "",
  });
  const [popupSaveName, setPopupSaveName] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const popupRef = useRef(null); // Tạo ref để tham chiếu đến popup

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
  const { isLogged } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.actionUser);
  const { slug } = useParams();
  useEffect(() => {
    dispatch(fetchDataListenPlaylist(slug));
  }, [dispatch, slug]);
  useEffect(() => {
    if (isLogged) {
      dispatch(fetchCurrentPlaylist());
    }
  }, [dispatch, isLogged]);

  const currentSong = playlistData?.songs?.[currentSongIndex];

  useEffect(() => {
    if (audioRef.current && currentSong) {
      // Lấy đường dẫn nhạc từ data và set vào audioRef
      audioRef.current.src = currentSong.audioPaths.normal; // Hoặc audioPaths.vip nếu bạn muốn chất lượng cao
      audioRef.current.play();
    }
  }, [currentSong]);

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
  const handleHeartClick = (idSong) => {
    setPopupVisible(true);
    setCurrentSelectedSong(idSong);
    const matchedPlaylists = profile?.wishlist?.filter((el) => {
      const existed = el?.songs.some((item) => item.toString() === idSong);
      return existed;
    });
    setSelectedPlaylists(matchedPlaylists?.map((el) => el?._id));
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPopupSaveName(false);
    reset();
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      closePopup(); // Đóng pop-up nếu click ra ngoài
    }
  };

  useEffect(() => {
    if (isPopupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupVisible]);

  const handleCheckboxSelected = async (plid, pln) => {
    try {
      // Kiểm tra nếu playlist đã được chọn

      // Gọi API
      const response = await apiUpandReWishList(currentSelectedSong, plid);

      if (response?.success) {
        {
          response?.isRemoved
            ? toast.success(`Remove from ${pln}`, { icon: "🚀" })
            : toast.success(`Added to ${pln}`, { icon: "🚀" });
        }
        const updatedData = response.mess;
        setSelectedPlaylists((prev) => {
          const isSelectedCurrent =
            updatedData.songs.includes(currentSelectedSong);
          if (isSelectedCurrent) {
            return [...prev, plid];
          }

          return prev.filter((idprev) => idprev !== plid);
        });
        console.log(selectedPlaylists);
      } else {
        toast.success(`Updated Failed`, { icon: "🚀" });
      }
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
  };

  const openNewPlaylistPopup = () => {
    setPopupVisible(false);
    setNewPlaylistPopupVisible(true); // Hiển thị pop-up
  };

  const closeNewPlaylistPopup = () => {
    setNewPlaylistPopupVisible(false); // Đóng pop-up
    setFormAddPlaylist({
      name: "",
      displayMode: "",
    });
    reset();
  };
  const handleAddplaylist = async (data) => {
    const displayMode =
      data.displayMode === "0"
        ? "Public"
        : data.displayMode === "1"
        ? "Private"
        : "";
    const dataUpdate = { ...data, displayMode: displayMode };

    try {
      const response = await apiCreateWishList(currentSelectedSong, dataUpdate);

      if (response?.success) {
        dispatch(fetchCurrentPlaylist());
        toast.success(`Added to ${data.name}`, { icon: "🚀" });
        closeNewPlaylistPopup();
      }
    } catch (error) {
      toast.error(`${error?.response?.data?.mess}`, { icon: "🚀" });
    }
    reset();
  };

  const handleSavePlaylist = async (slug) => {
    try {
      const response = await apiSaveAPlaylist(slug);
      console.log(response);

      if (response?.success) {
        dispatch(fetchCurrentPlaylist());
        toast.success(`Save ${response?.mess?.name}`, {
          icon: "🚀",
        });
      }
    } catch (error) {
      setPopupSaveName(true);

      toast.success(`${error?.response?.data?.mess}`, { icon: "🚀" });
    }
  };

  const handleSaveName = async (slug, data) => {
    const name = data.name;

    try {
      const response = await apiSaveAPlaylist2(slug, name);
      if (response?.success) {
        dispatch(fetchCurrentPlaylist());
        toast.success(`Save playlist with name: ${name} successfully`, {
          icon: "🚀",
        });
      }
    } catch (error) {
      toast.success(`${error?.response?.data?.mess}`, { icon: "🚀" });
    }
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
              <Tooltip title="Listen">
                <FaCirclePlay
                  fontSize="60px"
                  className="mt-3 mb-3"
                  cursor="pointer"
                  onClick={() =>
                    dispatch(
                      listenPlaylistReducer.actions.toggleMusicPlayer(true)
                    )
                  }
                />
              </Tooltip>

              <Tooltip title="Save">
              <MdAddCircleOutline
                fontSize="40px"
                className="mx-3 mt-2"
                cursor="pointer"
                onClick={() => handleSavePlaylist(slug)}
              />
              </Tooltip>
              <Tooltip title="More">
              <IoIosMore fontSize="30px" cursor="pointer" />
              </Tooltip>
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
                        <Tooltip title="Wishlist">
                          <RiHeartAddLine
                            fontSize="18px"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHeartClick(song._id);
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Download">
                          <BsDownload className="mx-2" />
                        </Tooltip>
                        <Tooltip title="Copy">
                          <LuExternalLink className="mx-1" />
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isPopupVisible &&
                (isLogged ? (
                  <div className="popup-overlay">
                    <div className="popup" ref={popupRef}>
                      <h4>Lưu vào!</h4>
                      {profile?.wishlist?.map((el, index) => (
                        <div key={index}>
                          <input
                            type="checkbox"
                            className="mx-3"
                            checked={selectedPlaylists.includes(el?._id)}
                            onChange={() =>
                              handleCheckboxSelected(el._id, el.name)
                            }
                          />
                          <label>{el?.name}</label>
                        </div>
                      ))}
                      <button
                        className="rounded-pill"
                        onClick={openNewPlaylistPopup}
                      >
                        <IoMdAdd className="mb-1 fs-4" />
                        Danh sách phát mới
                      </button>
                      {/* <button onClick={closePopup}>Đóng</button> */}
                    </div>
                  </div>
                ) : (
                  <div className="popup-overlay">
                    <div className="popup" ref={popupRef}>
                      <h4>Vui lòng đăng nhập</h4>
                      <p>Bạn cần đăng nhập để sử dụng tính năng này.</p>
                    </div>
                  </div>
                ))}
              {isNewPlaylistPopupVisible && (
                <div className="popup-overlay">
                  <div className="popup new-playlist-popup">
                    <h4>Tạo danh sách phát mới</h4>

                    <form
                      onSubmit={handleSubmit(handleAddplaylist)}
                      method="post"
                    >
                      <div className="form-group">
                        <label htmlFor="playlistName" className="form-label">
                          Name
                        </label>
                        <input
                          id="playlistName"
                          type="text"
                          placeholder="Nhập tên danh sách phát"
                          className="form-control"
                          {...register("name", {
                            required: "Name là bắt buộc",
                          })}
                        />
                      </div>
                      {errors.name && (
                        <div className="text-danger fs-6 justify-content-end">
                          {errors.name.message}
                        </div>
                      )}
                      <div className="form-group">
                        <label htmlFor="playlistPrivacy" className="form-label">
                          Visibility:
                        </label>
                        <select
                          id="playlistPrivacy"
                          className="form-control"
                          {...register("displayMode", {
                            required: "Chọn quyền riêng tư",
                          })}
                        >
                          <option value="0">Public</option>
                          <option value="1">Private</option>
                        </select>
                        {errors.displayMode && (
                          <span className="text-danger">
                            {errors.displayMode.message}
                          </span>
                        )}
                      </div>

                      {/* Nút Hủy và Tạo */}
                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          className="rounded-pill me-2"
                          onClick={closeNewPlaylistPopup}
                        >
                          Hủy
                        </button>
                        <button type="submit" className="rounded-pill">
                          Tạo
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {popupSaveName && (
                <div className="custom-popup-overlay">
                  <div className="custom-popup-container">
                    <h4>Nhập tên</h4>
                    <form
                      onSubmit={handleSubmit((data) =>
                        handleSaveName(slug, data)
                      )}
                      method="post"
                    >
                      <div className="custom-form-group">
                        <label
                          htmlFor="nameInput"
                          className="custom-form-label"
                        >
                          Vui lòng nhập tên khác để tránh trùng lặp
                        </label>
                        <input
                          id="nameInput"
                          type="text"
                          placeholder="Nhập tên"
                          className="custom-form-control"
                          {...register("name", { required: "Tên là bắt buộc" })}
                        />
                      </div>
                      {errors.name && (
                        <div className="text-danger fs-6">
                          {errors.name.message}
                        </div>
                      )}
                      <div className="custom-popup-actions">
                        <button
                          type="button"
                          className="custom-btn custom-btn-cancel"
                          onClick={closePopup}
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="custom-btn custom-btn-save"
                        >
                          Lưu
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-3 border menu_right">
          <div className="lyric">Lyric</div>
        </div>
      </div>

      {showMusicPlayer && (
        <div className="music-modal">
          <div className="close-btn" onClick={closeModal}>
            <IoMdClose />
          </div>
          <div className="song-info">
            <img
              src={
                playlistData?.songs[currentSongIndex]?.songImg ||
                "https://stc-id.nixcdn.com/v11/images/avatar_default.jpg"
              }
              alt="Song"
            />
            <div>
              {/* Hiển thị tên bài hát và tên ca sĩ của bài hát đang phát */}
              <h5>{playlistData?.songs[currentSongIndex]?.songName}</h5>{" "}
              {/* Tên bài hát */}
              <p>
                {playlistData?.songs[currentSongIndex]?.singerId?.map(
                  (singer, idx) => (
                    <span key={idx}>
                      {singer.singerName}
                      {idx <
                      playlistData.songs[currentSongIndex].singerId.length - 1
                        ? ", "
                        : ""}
                    </span>
                  )
                )}
              </p>{" "}
              {/* Ca sĩ */}
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
