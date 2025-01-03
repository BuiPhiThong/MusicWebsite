import React, { useEffect } from "react";
import "./Profile.css";
import { FaHome, FaEdit, FaPlay } from "react-icons/fa";
import { IoMdCreate } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrent } from "../../../../reducers/authSlice";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { isLogged, user, errorCurrent, accessToken } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    if (isLogged && accessToken) dispatch(fetchCurrent());
  }, [dispatch, isLogged, accessToken]);
  console.log(user);
 
  return (
    <div className="content-wrap">
      <div className="content-user-profile row">
        <div className="profile-user col-md-4">
          <div className="profile-avatar">
            <img
              src={
                user?.avatar ||
                "https://png.pngtree.com/png-clipart/20230817/original/pngtree-round-kid-avatar-boy-face-picture-image_8005285.png"
              }
              alt="User Avatar"
              className="avatar-image"
            />
          </div>
          <div className="profile-info">
            <h2 className="user-name">
              {user?.firstname?.toUpperCase()} {user?.lastname?.toUpperCase()}
            </h2>

            <p className="user-birthdate">
              Date of Birth:{" "}
              {user?.dateOfBirth ? user.dateOfBirth : "Chưa cập nhật"}
            </p>

            {/* <p className="user-gender">
              Gender: {user?.gender ? user?.gender : "Chưa cập nhật"}
            </p> */}
            <p className="user-gender">
              Account: {user?.isVip ? "Tài khoản vip" : "Tài khoản thường"}
            </p>
            {/* <ul className="view-user">
              <li className="view-profile">Lượt xem profile: 20</li>
              <li className="view-playlist">Lượt xem profile: 20</li>
            </ul> */}
          </div>
        </div>
        <div className="col-md-8">
          <div className="propose-paylist-container">
            <div className="propose-paylist">
              <div className="box-suggestion">
                <a href="" className="suggestion-playlist img1 f3">
                  <span className="icon-play"></span>
                  <h3>Calibaba</h3>
                  <img
                    src="https://avatar-ex-swe.nixcdn.com/playlist/2024/12/12/f/7/c/5/1733988147902_300.jpg"
                    alt=""
                  />
                </a>
              </div>
            </div>
            <div className="propose-paylist">
              <div className="box-suggestion">
                <a href="" className="suggestion-playlist2 img2 f3">
                  <span className="icon-play"></span>
                  <h3>Song Two</h3>
                  <img
                    src="https://avatar-ex-swe.nixcdn.com/singer/avatar/2014/04/11/6/4/4/b/1397189703544.jpg"
                    alt=""
                  />
                </a>
              </div>
            </div>
            <div className="propose-paylist">
              <div className="box-suggestion">
                <a href="" className="suggestion-playlist img f3">
                  <span className="icon-play"></span>
                  <h3>Song Three</h3>
                  <img
                    src="https://avatar-ex-swe.nixcdn.com/playlist/2024/12/18/0/d/0/7/1734490170591_300.jpg"
                    alt=""
                  />
                </a>
              </div>
            </div>
            <div className="propose-paylist">
              <div className="box-suggestion">
                <a href="" className="suggestion-playlist4 img4 f3">
                  <span className="icon-play"></span>
                  <h3>Song Four</h3>
                  <img
                    src="https://avatar-ex-swe.nixcdn.com/playlist/2024/12/05/a/4/a/b/1733395967322.jpg"
                    alt=""
                  />
                </a>
              </div>
            </div>
            <div className="propose-paylist">
              <div className="box-suggestion">
                <a href="" className="suggestion-playlist img f3">
                  <span className="icon-play"></span>
                  <h3>Song Five</h3>
                  <img
                    src="https://avatar-ex-swe.nixcdn.com/song/2024/12/27/8/5/0/6/1735295802802_300.jpg"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-user-menu row">
        <ul className="list-unstyled d-flex">
          <li>
            <FaHome className="fs-4 text-primary" onClick={()=>navigate('/')}/>
          </li>
          <li>Playlist</li>
          <li>Video</li>
          <li>Tui Upload</li>
          <li>Bạn bè</li>
        </ul>
      </div>

      <div className="content-playlist row mt-3">
        <div className="col-md-8">
          <h3 className="center_1">PLAYLIST | ALBUM</h3>
          <div className="d-flex justify-content-end">
            <div
              className="mx-1 action-button"
              onClick={() => alert("Tạo Playlist")}
            >
              Tạo Playlist <IoMdCreate className="mb-1" />
            </div>
            <div className="action-button" onClick={() => alert("Chỉnh sửa")}>
              Chỉnh sửa <FaEdit className="mb-1" />
            </div>
          </div>
          <ul className="row gap-3 list-unstyled mt-3">
            {user?.wishlist?.map((el, index) => (
              <li className="col-md-2 playlist-item">
                <div className="image-container">
                  <a href="#">
                    <img
                      src={
                        el?.image ||
                        "https://avatar-ex-swe.nixcdn.com/playlist/2022/10/01/2/d/e/d/1664607678311.jpg"
                      }
                      alt="Playlist 1"
                    />

                    <span className="play-icon">▶</span>
                  </a>
                </div>
                <div className="mt-2">{el.name}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-4 content-left">
          <div className="box">
            <h3>Gợi ý dành cho bạn</h3>
            <p>Thưởng thức ca khúc phù hợp nhất với bạn</p>
            <button className="play-button py-2 px-2">
              <FaPlay className="mx-2" />
              Nghe bài hát
            </button>
          </div>

          <div className="mt-3 center_left">
            <h3>Danh hiệu</h3>
            <p>Bạn là đang nằm trong top donate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
