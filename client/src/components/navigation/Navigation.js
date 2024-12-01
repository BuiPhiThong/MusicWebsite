
import React, { useState, useEffect, useRef } from "react";
import "./navigation.css";
import { CiSearch } from "react-icons/ci";
import { RiVipFill } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai"; // Import icon xóa
import { PiPlaylistFill } from "react-icons/pi";
import { GiMicrophone } from "react-icons/gi";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdClear } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataPopupSearch } from "../../reducers/popupSearchSlice";
import { IoIosMusicalNotes } from "react-icons/io";

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const searchInputRef = useRef(null);
  const historyPopupRef = useRef(null);
  
  const [searchHistory, setSearchHistory] = useState([]); // Lưu lịch sử tìm kiếm từ localStorage
  
  // Lấy dữ liệu tìm kiếm từ Redux store
  const { dataPopup, loadingPopup } = useSelector((state) => state.popupSearch);
  
  // Lấy lịch sử tìm kiếm từ localStorage khi component mount
  useEffect(() => {
    const storedHistory =
    JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedHistory);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        historyPopupRef.current &&
        !historyPopupRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSearchInputClick = () => {
    setShowHistory(true);
  };

  const handleHistoryClick = (term) => {
    setSearchQuery(term);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    setSearchQuery(""); // Xóa từ khóa tìm kiếm
    dispatch(fetchDataPopupSearch("")); // Gửi yêu cầu API với chuỗi rỗng để xóa kết quả
    localStorage.removeItem("searchHistory"); // Xóa lịch sử tìm kiếm khỏi localStorage
    setSearchHistory([]); // Cập nhật state lịch sử tìm kiếm
  };

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      dispatch(fetchDataPopupSearch(query)); // Gọi API khi thay đổi giá trị
    } else {
      dispatch(fetchDataPopupSearch("")); // Gọi API với chuỗi rỗng để xóa kết quả
    }
  };
  
  // Xử lý sự kiện khi nhấn Enter
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  
  const handleSearchSubmit = () => {
    if (searchQuery) {
      // Lưu lịch sử tìm kiếm vào localStorage
      const updatedHistory = [...searchHistory, searchQuery];
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      setSearchHistory(updatedHistory); // Cập nhật state lịch sử tìm kiếm
      
      // Gửi tìm kiếm hoặc thực hiện hành động tìm kiếm
      dispatch(fetchDataPopupSearch(searchQuery));
      setShowHistory(false); // Ẩn lịch sử khi tìm kiếm
    }
  };
  const handleRemoveHistoryItem = (term) => {
    // Xóa từ lịch sử tìm kiếm, ví dụ sử dụng LocalStorage hoặc Redux
    const updatedHistory = searchHistory.filter((item) => item !== term);
    setSearchHistory(updatedHistory);
    
    // Cập nhật lại lịch sử tìm kiếm vào localStorage nếu cần
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const handleLoginClick = () => {
    navigate("/login");
  };
  
  const handleRegisterClick = () => {
    navigate("/login?isRegister=true");
  };

  return (
    <div className="row align-items-center pt-3">
      <div className="col-md-6">
        <div className="menu_left">
          <ul className="d-flex gap-3 list-unstyled">
            <a className="logo" href="/">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT379f4qTjkZuhEyY4z270oLdoHGGAMRiKMsA&s"
                alt="Logo"
                />
            </a>
            <li className="mt-2">Khám phá</li>
            <li className="mt-2">Bài hát</li>
            <li className="mt-2">Playlist</li>
            <li className="mt-2">BXH</li>
          </ul>
        </div>
      </div>
      <div className="col-md-6">
        <div className="row">
          <div className="col-md-6">
            <ul className="d-flex gap-3 list-unstyled">
              <li className="mt-2">
                <div className="search-container">
                  <CiSearch className="fs-3" />
                  <input
                    className="rounded-pill"
                    type="text"
                    placeholder="Tìm kiếm"
                    value={searchQuery}
                    ref={searchInputRef}
                    onClick={handleSearchInputClick}
                    onChange={handleInputChange} // Cập nhật giá trị khi người dùng gõ
                    onKeyDown={handleKeyDown} // Thêm sự kiện "Enter"
                    />
                  {showHistory && (
                    <div
                    className="search-history-popup mt-2"
                    ref={historyPopupRef}
                    >
                      {loadingPopup ? (
                        <div>Đang tải...</div>
                      ) : (
                        <>
                          {/* Hiển thị các kết quả tìm kiếm đầu tiên */}
                          {dataPopup?.singers?.length > 0 && (
                            <div className="history-section mt-2">
                              <h6>
                                <GiMicrophone className="text-danger mx-1" />
                                Nghệ sĩ
                              </h6>
                              {dataPopup.singers.map((singer, index) => (
                                <div key={index} className="history-item">
                                  <span
                                    onClick={() =>
                                      handleHistoryClick(singer.singerName)
                                    }
                                    className="history-term"
                                    >
                                    {singer.singerName}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Bài hát */}
                          {dataPopup?.songs?.length > 0 && (
                            <div className="history-section mt-2">
                              <h6>
                                <IoIosMusicalNotes className="text-danger mx-1" />
                                Bài hát
                              </h6>
                              {dataPopup.songs.map((song, index) => (
                                <div key={index} className="history-item">
                                  <span
                                    onClick={() =>
                                      handleHistoryClick(song.songName)
                                    }
                                    className="history-term"
                                  >
                                    {song.songName}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Playlist */}
                          {dataPopup?.playlists?.length > 0 && (
                            <div className="history-section mt-2">
                              <h6>
                                <PiPlaylistFill className="text-danger mx-1" />
                                Playlist
                              </h6>
                              {dataPopup.playlists.map((playlist, index) => (
                                <div key={index} className="history-item">
                                  <span
                                    onClick={() =>
                                      handleHistoryClick(playlist.name)
                                    }
                                    className="history-term"
                                  >
                                    {playlist.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Hiển thị lịch sử tìm kiếm ở dưới cùng */}
                          <div className="history-section mt-4">
                            <div className="d-flex justify-content-between align-items-center">
                              <h6>Lịch sử tìm kiếm của bạn</h6>
                              <FaRegTrashAlt
                                className="clear-history-icon"
                                onClick={handleClearHistory}
                                style={{
                                  cursor: "pointer",
                                  fontSize: "18px",
                                  color: "#888",
                                }}
                              />
                            </div>

                            {searchHistory.length > 0 ? (
                              searchHistory.map((term, index) => (
                                <div
                                key={index}
                                className="history-item d-flex justify-content-between align-items-center"
                                >
                                  <span
                                    onClick={() => handleHistoryClick(term)}
                                    className="history-term"
                                    >
                                    {term}
                                  </span>

                                  <MdClear
                                    className="remove-item-icon"
                                    onClick={() =>
                                      handleRemoveHistoryItem(term)
                                    } // Hàm xóa phần tử lịch sử
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "16px",
                                      color: "#888",
                                    }}
                                  />
                                </div>
                              ))
                            ) : (
                              <div>Không có lịch sử tìm kiếm.</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </li>
              <RiVipFill className="fs-3 mt-2 text-danger" />
            </ul>
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            <button
              onClick={handleLoginClick}
              className="btn btn-light mt-2 my-3 mx-2 rounded-pill"
            >
              Đăng nhập
            </button>
            <button
              onClick={handleRegisterClick}
              className="btn btn-primary mt-2 my-3 rounded-pill"
              >
              Đăng kí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;

// import React, { useState, useEffect, useRef } from "react";
// import "./navigation.css";
// import { CiSearch } from "react-icons/ci";
// import { RiVipFill } from "react-icons/ri";
// import { AiOutlineClose } from "react-icons/ai"; // Import icon xóa
// import { PiPlaylistFill } from "react-icons/pi";
// import { GiMicrophone } from "react-icons/gi";
// import { FaRegTrashAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDataPopupSearch } from "../../reducers/popupSearchSlice";
// import { IoIosMusicalNotes } from "react-icons/io";

// const Navigation = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [showHistory, setShowHistory] = useState(false);
//   const searchInputRef = useRef(null);
//   const historyPopupRef = useRef(null);

//   // Lấy dữ liệu tìm kiếm từ Redux store
//   const { dataPopup, loadingPopup } = useSelector((state) => state.popupSearch);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         historyPopupRef.current &&
//         !historyPopupRef.current.contains(event.target) &&
//         !searchInputRef.current.contains(event.target)
//       ) {
//         setShowHistory(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);

//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   const handleSearchInputClick = () => {
//     setShowHistory(true);
//   };

//   const handleHistoryClick = (term) => {
//     setSearchQuery(term);
//     setShowHistory(false);
//   };

//   const handleClearHistory = () => {
//     setSearchQuery(""); // Xóa từ khóa tìm kiếm
//     dispatch(fetchDataPopupSearch("")); // Gửi yêu cầu API với chuỗi rỗng để xóa kết quả
//   };

//   const handleInputChange = (event) => {
//     const query = event.target.value;
//     setSearchQuery(query);

//     if (query) {
//       dispatch(fetchDataPopupSearch(query)); // Gọi API khi thay đổi giá trị
//     } else {
//       dispatch(fetchDataPopupSearch("")); // Gọi API với chuỗi rỗng để xóa kết quả
//     }
//   };

//   const handleLoginClick = () => {
//     navigate("/login");
//   };

//   const handleRegisterClick = () => {
//     navigate("/login?isRegister=true");
//   };

//   console.log(dataPopup);

//   return (
//     <div className="row align-items-center pt-3">
//       <div className="col-md-6">
//         <div className="menu_left">
//           <ul className="d-flex gap-3 list-unstyled">
//             <a className="logo" href="/">
//               <img
//                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT379f4qTjkZuhEyY4z270oLdoHGGAMRiKMsA&s"
//                 alt="Logo"
//               />
//             </a>
//             <li className="mt-2">Khám phá</li>
//             <li className="mt-2">Bài hát</li>
//             <li className="mt-2">Playlist</li>
//             <li className="mt-2">BXH</li>
//           </ul>
//         </div>
//       </div>
//       <div className="col-md-6">
//         <div className="row">
//           <div className="col-md-6">
//             <ul className="d-flex gap-3 list-unstyled">
//               <li className="mt-2">
//                 <div className="search-container">
//                   <CiSearch className="fs-3" />
//                   <input
//                     className="rounded-pill"
//                     type="text"
//                     placeholder="Tìm kiếm"
//                     value={searchQuery}
//                     ref={searchInputRef}
//                     onClick={handleSearchInputClick}
//                     onChange={handleInputChange} // Cập nhật giá trị khi người dùng gõ
//                   />
//                   {showHistory && (
//                     <div
//                       className="search-history-popup mt-2"
//                       ref={historyPopupRef}
//                     >
//                       {loadingPopup ? (
//                         <div>Đang tải...</div>
//                       ) : (
//                         <>
//                           {/* Nghệ sĩ */}
//                           {dataPopup?.singers?.length > 0 && (
//                             <div className="history-section mt-2">
//                               <h6>
//                                 <GiMicrophone className="text-danger mx-1" />
//                                 Nghệ sĩ
//                               </h6>
//                               {dataPopup.singers.map((singer, index) => (
//                                 <div key={index} className="history-item">
//                                   <span
//                                     onClick={() =>
//                                       handleHistoryClick(singer.singerName)
//                                     }
//                                     className="history-term"
//                                   >
//                                     {singer.singerName}
//                                   </span>
//                                 </div>
//                               ))}
//                             </div>
//                           )}

//                           {/* Bài hát */}
//                           {dataPopup?.songs?.length > 0 && (
//                             <div className="history-section">
//                               <h6>
//                                 <IoIosMusicalNotes className="text-danger mx-1" />
//                                 Bài hát
//                               </h6>
//                               {dataPopup.songs.map((song, index) => (
//                                 <div key={index} className="history-item">
//                                   <span
//                                     onClick={() =>
//                                       handleHistoryClick(song.songName)
//                                     }
//                                     className="history-term"
//                                   >
//                                     {song.songName}
//                                   </span>
//                                 </div>
//                               ))}
//                             </div>
//                           )}

//                           {/* Playlist */}
//                           {dataPopup?.playlists?.length > 0 && (
//                             <div className="history-section">
//                               <h6>
//                                 <PiPlaylistFill className="text-danger mx-1" />
//                                 Playlist
//                               </h6>
//                               {dataPopup.playlists.map((playlist, index) => (
//                                 <div key={index} className="history-item">
//                                   <span
//                                     onClick={() =>
//                                       handleHistoryClick(playlist.name)
//                                     }
//                                     className="history-term"
//                                   >
//                                     {playlist.name}
//                                   </span>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                           <div className="history-header">
//                             Lịch sử tìm kiếm của bạn
//                             <FaRegTrashAlt
//                               className="clear-history-icon"
//                               onClick={handleClearHistory}
//                             />
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </li>
//               <RiVipFill className="fs-3 mt-2 text-danger" />
//             </ul>
//           </div>
//           <div className="col-md-6 d-flex justify-content-end">
//             <button
//               onClick={handleLoginClick}
//               className="btn btn-light mt-2 my-3 mx-3 rounded-pill"
//             >
//               Đăng nhập
//             </button>
//             <button
//               onClick={handleRegisterClick}
//               className="btn btn-primary mt-2 my-3 rounded-pill"
//             >
//               Đăng kí
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navigation;