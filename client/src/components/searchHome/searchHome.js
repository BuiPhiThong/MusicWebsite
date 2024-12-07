import React, { useEffect, useState } from "react";
import Navigation from "../navigation/Navigation";
import Sidebar from "../sidebar/Sidebar";
import { FaHeartCirclePlus } from "react-icons/fa6";
import { BsCopy } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import "./searchHome.css";
import { useDispatch, useSelector } from "react-redux";
import { data, useLocation, useNavigate } from "react-router-dom";
import dataSearchReducer, {
  fetchDataSearchAll,
  fetchDataSongSearch,
  fetchDataPlaylistSearch,
  fetchDataSingerSearch,
} from "../../reducers/dataSearchSlice";

const SearchHome = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("all"); // Trạng thái tìm kiếm, 'all' cho tất cả, 'song' cho bài hát
  const [keySearch, setKeySearch] = useState(""); // Trạng thái tìm kiếm, 'all' cho tất cả, 'song' cho bài hát

  const {
    dataAllSearch,
    loadingSearchAll,
    errorSearchAll,

    dataSongSearch,
    loadingSongSearch,
    errorSongSearch,
    currentPageSong,
    startPage,
    pagesToShow,
    totalPageSong,
    countSong,

    dataPlaylistSearch,
    loadingPlaylistSearch,
    errorPlaylistSearch,

    dataSingerSearch,
    loadingSingerSearch,
    errorSingerSearch,
  } = useSelector((state) => state.dataSearch);

  //data All
  const {
    dataSongAll,
    countSongAll,
    counPlaylistAll,
    countPlaylistSingerAll,
    sumPlaylistAll,
    dataPlaylistAll,
  } = dataAllSearch;
  //data song search
  const { countSongSearch, listSongSearch } = dataSongSearch;
  //data playlist
  const { countPlaylistSearch, listPlaylistSearch } = dataPlaylistSearch;
  //data singer search
  const { countSingerSearch, listSingerSearch } = dataSingerSearch;
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("keyword");
    setKeySearch(searchQuery);

    // Kiểm tra nếu có truy vấn tìm kiếm
    if (searchQuery) {
      switch (searchType) {
        case "song":
          dispatch(
            fetchDataSongSearch({
              text: searchQuery,
              page: currentPageSong,
              limit: 5,
            })
          );
          break;
        case "playlist":
          dispatch(fetchDataSearchAll(searchQuery)); // Gọi API tìm kiếm Playlist
          break;
        case "singer":
          dispatch(fetchDataSingerSearch(searchQuery)); // Gọi API tìm kiếm Singer
          break;
        default:
          dispatch(fetchDataSearchAll(searchQuery)); // Gọi API tìm kiếm tất cả
      }
    }
  }, [location, dispatch, searchType]);

  const handleSongSearchClick = () => {
    setSearchType("song");
    // const searchQuery = new URLSearchParams(location.search).get("all");
    // if (searchQuery) {
    //   dispatch(fetchDataSongSearch(searchQuery, currentPageSong, limitSong)); // Gọi API tìm kiếm bài hát
    // }
  };
  const handleClickPlaylist = () => {
    setSearchType("playlist");
    // const searchQuery = new URLSearchParams(location.search).get("all");
    // if (searchQuery) {
    //   dispatch(fetchDataSearchAll(searchQuery)); // Gọi API tìm kiếm Playlist
    // }
  };

  const handleClickSinger = () => {
    setSearchType("singer");
    // const searchQuery = new URLSearchParams(location.search).get("all");
    // if (searchQuery) {
    //   dispatch(fetchDataSingerSearch(searchQuery)); // Gọi API tìm kiếm Singer
    // }
  };

  // const handlePageChange = (newPage) => {
  //   if (newPage > 0 && newPage <= totalPageSong) {
  //     dispatch(dataSearchReducer.actions.setCurrentPageSong(newPage)); // Cập nhật trang hiện tại
  //     dispatch(
  //       fetchDataSongSearch({ text: keySearch, page: newPage, limit: 5 })
  //     );
  //   }
  // };

  const handlePageChange = (page) => {
    dispatch(dataSearchReducer.actions.setCurrentPageSong(page));

    // Điều chỉnh startPage nếu cần
    if (page < startPage) {
      dispatch(dataSearchReducer.actions.updateStartPage(Math.max(page, 1)));
    } else if (page >= startPage + pagesToShow) {
      dispatch(
        dataSearchReducer.actions.updateStartPage(page - pagesToShow + 1)
      );
    }

    // Gọi API để lấy dữ liệu của trang
    dispatch(fetchDataSongSearch({ text: keySearch, page, limit: 5 }));
  };

  const visiblePages = Array.from(
    { length: Math.min(pagesToShow, totalPageSong - startPage + 1) },
    (_, index) => startPage + index
  );

  return (
    <div className="container">
      <Navigation />
      <hr style={{ margin: "0px" }} />
      <div className="row mt-3">
        <div className="col-md-9">
          <h3>Tìm kiếm</h3>

          <div>
            <ul className="search-list list-unstyled d-flex">
              <li
                className={searchType === "all" ? "btn btn-danger" : ""}
                onClick={() => setSearchType("all")}
              >
                Tất cả
              </li>
              <li
                className={searchType === "song" ? "btn btn-danger" : ""}
                onClick={handleSongSearchClick}
              >
                Bài hát
              </li>
              <li
                className={searchType === "playlist" ? "btn btn-danger" : ""}
                onClick={handleClickPlaylist}
              >
                Playlist
              </li>
              <li
                className={searchType === "singer" ? "btn btn-danger" : ""}
                onClick={handleClickSinger}
              >
                Singer
              </li>
              <li className="filter-item">
                Lọc
                <FaFilter />
              </li>
            </ul>
          </div>

          {searchType === "all" ? (
            <div>
              <div>
                <h3 className="mt-4 title_search">
                  <a href="" className="text-decoration-none">
                    BÀI HÁT
                    <span>(Có {countSongAll} kết quả)</span>
                  </a>
                </h3>
              </div>
              <div>
                <ul className="list-unstyled">
                  {loadingSearchAll ? (
                    <p>...Loading</p>
                  ) : (
                    dataSongAll.map((el, index) => (
                      <li key={index} className="sn_search_single_song">
                        <a href="#" className="">
                          <img src={el.songImg} alt="" className="thumb" />
                        </a>
                        <div className="box_info">
                          <h3 className="title_song">
                            <a href="#" className="text-decoration-none">
                              <span className="ms_kw mb-4">{el.songName}</span>
                            </a>
                          </h3>
                          <div>
                            {el.singerId.map((name, index) => (
                              <a
                                key={index}
                                className="name_singer text-decoration-none"
                              >
                                {name.singerName}
                              </a>
                            ))}
                          </div>
                          <div className="icon-actions">
                            <FaHeartCirclePlus className="text-danger" />
                            <BsCopy className="text-primary mx-3" />
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {/* component playlist */}
          {searchType === "playlist" ? (
            <div>
              <div>
                <h3 className="mt-4 title_search">
                  <a href="#" className="text-decoration-none">
                    Playlist
                    <span>(Có {sumPlaylistAll} kết quả)</span>
                  </a>
                </h3>
              </div>
              {loadingSearchAll ? (
                <p>...Loading</p>
              ) : (
                <ul className="row gap-1 list-unstyled mt-3">
                  {dataPlaylistAll.map((playlist, index) => (
                    <li key={index} className="col-md-2">
                      <div>
                        <a href="#">
                          <img
                            src="https://avatar-ex-swe.nixcdn.com/playlist/2024/08/21/1/9/4/f/1724238568695.jpg" // Có thể thay bằng trường image từ API
                            alt={playlist.name} // Dùng tên playlist làm alt cho ảnh
                          />
                        </a>
                      </div>
                      <div className="mt-2">{playlist.name}</div>{" "}
                      {/* Hiển thị tên playlist */}
                      {/* Kiểm tra nếu playlist có sub-playlist */}
                      {playlist?.playlist && (
                        <ul className="row gap-1 list-unstyled">
                          {playlist.playlist.map((subPlaylist, subIndex) => (
                            <li key={subIndex}>
                              <div>{subPlaylist.name}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div></div>
          )}

          {searchType === "song" ? (
            <div>
              <div>
                <h3 className="mt-4 title_search">
                  <a href="" className="text-decoration-none">
                    BÀI HÁT
                    <span>(Có {countSongSearch} kết quả)</span>
                  </a>
                </h3>
              </div>

              <div>
                <ul className="list-unstyled">
                  {listSongSearch?.map((song, index) => (
                    <li key={index} className="sn_search_single_song">
                      <a href="#" className="">
                        <img src={song.songImg} alt="" className="thumb" />
                      </a>
                      <div className="box_info">
                        <h3 className="title_song">
                          <a href="#" className="text-decoration-none">
                            <span className="ms_kw mb-4">{song.songName}</span>
                          </a>
                        </h3>
                        <div>
                          {song.singerId.map((name, index) => (
                            <a
                              key={index}
                              className="name_singer text-decoration-none"
                            >
                              {name.singerName}
                            </a>
                          ))}
                        </div>
                        <div className="icon-actions">
                          <FaHeartCirclePlus className="text-danger" />
                          <BsCopy className="text-primary mx-3" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>.</div>
              <div className="pagination">
                {/* Nút Previous (chuyển nhóm trang) */}
                <button
                  disabled={startPage === 1}
                  onClick={() =>
                    dispatch(
                      dataSearchReducer.actions.updateStartPage(
                        Math.max(startPage - pagesToShow, 1)
                      )
                    )
                  }
                >
                  Previous
                </button>

                {/* Icon Previous (chuyển trang liền kề) */}
                {currentPageSong > 1 && (
                  <GrPrevious
                    className="fs-2 cursor-pointer"
                    onClick={() => handlePageChange(currentPageSong - 1)}
                  />
                )}

                {/* Danh sách số trang */}
                {visiblePages.map((page) => (
                  <button
                    key={page}
                    className={`page-btn mx-1 ${
                      currentPageSong === page ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                {/* Icon Next (chuyển trang liền kề) */}
                {currentPageSong < totalPageSong && (
                  <GrNext
                    className="fs-2 cursor-pointer"
                    onClick={() => handlePageChange(currentPageSong + 1)}
                  />
                )}

                {/* Nút Next (chuyển nhóm trang) */}
                <button
                  disabled={startPage + pagesToShow > totalPageSong}
                  onClick={() =>
                    dispatch(
                      dataSearchReducer.actions.updateStartPage(
                        Math.min(
                          startPage + pagesToShow,
                          totalPageSong - pagesToShow + 1
                        )
                      )
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {searchType === "singer" ? (
            <div>
              <div>
                <h3 className="mt-4 title_search">
                  <a href="" className="text-decoration-none">
                    Playlist
                    <span>(Có 10 kết quả)</span>
                  </a>
                </h3>
              </div>
              <ul className="row gap-1 list-unstyled mt-3">
                <li className="col-md-2">
                  <div>
                    <a href="#">
                      <img
                        src="https://avatar-ex-swe.nixcdn.com/playlist/2024/08/21/1/9/4/f/1724238568695.jpg" // Sử dụng trường image từ API
                        alt="" // Sử dụng tên playlist làm alt cho ảnh
                      />
                    </a>
                  </div>
                  <div className="mt-2"></div>
                </li>
              </ul>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="col-md-3 border">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default SearchHome;
