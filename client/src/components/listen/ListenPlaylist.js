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

const ListenPlaylist = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [volume, setVolume] = useState(100); // Mức âm lượng mặc định là 100%
  const [currentTime, setCurrentTime] = useState(0); // Thời gian hiện tại của bài hát
  const [duration, setDuration] = useState(0); // Tổng thời gian bài hát
  const [savedTime, setSavedTime] = useState(0); // Lưu trữ thời gian đã dừng

  const audioRef = useRef(null); // Tham chiếu tới thẻ <audio>
  
  const audioUrl = "https://vnno-ne-2-tf-a128-z3.zmdcdn.me/90a19c89a3d2eca643021510388e05c9?authen=exp=1733911720~acl=/90a19c89a3d2eca643021510388e05c9*~hmac=f3ca1f2f265f76f49f1bb40a5e2c4dca"
  const { slug } = useParams() 
  console.log(slug);
  
  // Hàm điều khiển phát / dừng nhạc
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause(); // Tạm dừng bài hát
    } else {
      audioRef.current.play(); // Phát bài hát từ thời gian hiện tại (savedTime)
    }
    setIsPlaying(!isPlaying); // Cập nhật trạng thái phát nhạc
  };
  

  // Hàm cập nhật tiến độ bài hát
  // Hàm cập nhật tiến độ bài hát
const updateProgress = () => {
  if (audioRef.current) {  // Kiểm tra nếu audioRef.current tồn tại
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    const progress = (current / total) * 100;
    setSongProgress(progress); // Cập nhật tiến độ bài hát
    setCurrentTime(current); // Cập nhật thời gian hiện tại
  }
};


  // Thực hiện cập nhật tiến độ mỗi giây
  useEffect(() => {
    if (isPlaying && showMusicPlayer) {  // Chỉ chạy khi đang phát nhạc và modal mở
      const interval = setInterval(updateProgress, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, showMusicPlayer]);  // Khi tắt modal (setShowMusicPlayer = false), interval sẽ được clear
  

  // Hàm đóng modal
  const closeModal = () => {
    // Lưu thời gian hiện tại vào savedTime
    setSavedTime(currentTime);
    setShowMusicPlayer(false);
    audioRef.current && audioRef.current.pause();  // Dừng nhạc khi đóng modal
    setIsPlaying(false);  // Đảm bảo trạng thái không còn là "đang phát"
  };
  
  

  // Hàm điều chỉnh âm lượng
  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
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
  setSongProgress(e.target.value); // Cập nhật tiến độ thanh slider
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
                <h1 className="title_playlist">Daily mix 2</h1>
                <div>Justin Bieber</div>
                <div>50 songs, about 3hr</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 coltrol_bar">
              <FaCirclePlay
                fontSize="60px"
                className="mt-3 mb-3"
                onClick={() => setShowMusicPlayer(true)}
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
                  <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>
                      <RiHeartAddLine fontSize="18px" />
                      <BsDownload className="mx-2" />
                      <LuExternalLink className="mx-1" />
                    </td>
                  </tr>
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
      {showMusicPlayer && (
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
            <span>{formatTime(currentTime)}/{formatTime(duration)}</span>
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


          {/* Thẻ audio để phát nhạc */}
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="auto"
            onLoadedMetadata={() => setDuration(audioRef.current.duration)} // Cập nhật tổng thời gian bài hát
            onTimeUpdate={updateProgress} // Cập nhật tiến độ khi phát nhạc
          />
        </div>
      )}
    </div>
  );
};

export default ListenPlaylist;
