import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "../../reducers/countrySlice";
import { fetchTop1Songs, fetchTop2Songs, fetchTop3Songs, fetchTop4to10Songs } from "../../reducers/topSongSlice"; // Đảm bảo bạn đã import các hành động fetchTopXSongs

const Sidebar = () => {
  const [activeButton, setActiveButton] = useState("");
  const dispatch = useDispatch();
  const { loadingCountry, errorCountry, countries } = useSelector(
    (state) => state.top3Country
  );
  const { top1Songs, top2Songs, top3Songs, top4to10Songs, loadingTop1, loadingTop2, loadingTop3, loadingTop4to10 } = useSelector(
    (state) => state.songs
  );
  
  // Gọi API lấy quốc gia
  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    if (countries.length > 0 && !activeButton) {
      setActiveButton(countries[0]._id); // Chọn quốc gia đầu tiên làm mặc định
    }
  }, [countries, activeButton]);
  
  
  // Gọi API bài hát khi quốc gia thay đổi
  useEffect(() => {
    if (activeButton && !loadingCountry) {
      // Thêm thời gian chờ 5 giây trước khi gọi API bài hát
      dispatch(fetchTop1Songs(activeButton));
      dispatch(fetchTop2Songs(activeButton));
      dispatch(fetchTop3Songs(activeButton));
      dispatch(fetchTop4to10Songs(activeButton));
      
    }
}, [dispatch, activeButton, loadingCountry]); // Thêm loadingCountry vào dependencies
  
return (
  <div>
      <h3 className="text-primary">BXH BÀI HÁT</h3>
      <div className="btn-group w-100" role="group">
        {countries?.map((country, index) => (
          <button
          key={index}
          type="button"
          className={`btn rounded-pill ${activeButton === country._id ? "btn-danger" : ""}`}
          onClick={() => setActiveButton(country._id)}
          >
            {country.countryName}
          </button>
        ))}
      </div>

      <div className="mt-3 list-music">
        <ul className="list-unstyled">
          {/* Top 1 */}
          {loadingTop1 ? (
            <li>Loading Top 1...</li>
          ) : (
            top1Songs?.map((song, index) => (
              <li key={index} className="one">
                <div className="info-one">
                  <a href="">
                    <span className="number special-1">{index + 1}</span>
                    <img src={song.songImg || "default_image.jpg"} alt={song.songName} />
                  </a>
                  <div className="d-flex flex-column mb-3">
                    <p>
                      <a href="">{song.songName}</a>
                    </p>
                    <span>{song.singers.map(el=>el.singerName)}</span>
                  </div>
                </div>
              </li>
            ))
          )}

          {/* Top 2 */}
          {loadingTop2 ? (
            <li>Loading Top 2...</li>
          ) : (
            top2Songs?.map((song, index) => (
              <li key={index} className="one">
                <div className="info-one">
                  <a href="">
                    <span className="number special-2">{index + 2}</span>
                    
                  </a>
                  <div className="d-flex flex-column mb-3">
                    <p>
                      <a href="">{song.songName}</a>
                    </p>
                    <span>{song.singers.map(el=>el.singerName)}</span>
                  </div>
                </div>
              </li>
            ))
          )}

          {/* Top 3 */}
          {loadingTop3 ? (
            <li>Loading Top 3...</li>
          ) : (
            top3Songs?.map((song, index) => (
              <li key={index} className="one">
                <div className="info-one">
                  <a href="">
                    <span className="number special-3">{index + 3}</span>
                   
                  </a>
                  <div className="d-flex flex-column mb-3">
                    <p>
                      <a href="">{song.songName}</a>
                    </p>
                    <span>{song.singers.map(el=>el.singerName)}</span>
                  </div>
                </div>
              </li>
            ))
          )}

          {/* Top 4-10 */}
          {loadingTop4to10 ? (
            <li>Loading Top 4-10...</li>
          ) : (
            top4to10Songs?.map((song, index) => (
              <li key={index} className="one">
                <div className="info-one">
                  <a href="">
                    <span className="number special-4">{index + 4}</span>
                  </a>
                  <div className="d-flex flex-column mb-3">
                    <p>
                      <a href="">{song.songName}</a>
                    </p>
                    <span>{song.singers.map(el=>el.singerName)}</span>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

// import React, { useEffect, useState } from "react";
// import "./sidebar.css";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCountries } from "../../reducers/countrySlice";

// const Sidebar = () => {
//   const [activeButton, setActiveButton] = useState("");
//   const dispatch = useDispatch();
//   const { loadingCountry, errorCountry, countries } = useSelector(
//     (state) => state.top3Country
//   );

//   useEffect(() => {
//     dispatch(fetchCountries());
//   }, [dispatch]);

//     // Cập nhật activeButton khi countries thay đổi
//     useEffect(() => {
//       if (countries.length > 0 && !activeButton) {
//         setActiveButton(countries[0]._id); // Chọn quốc gia đầu tiên làm mặc định
//       }
//     }, [countries, activeButton]); // Theo dõi thay đổi của countries và activeButton
//   return (
//     <div>
//       <h3 className="text-primary">BXH BÀI HÁT</h3>
//       <div className="btn-group w-100" role="group">
//         {countries?.map((country, index) => (
//           <button
//           key={index}
//             type="button"
//             className={`btn rounded-pill ${
//               activeButton === country._id ? "btn-danger" : ""
//             }`}
//             onClick={() => setActiveButton(country._id)}
//           >
//             {country.countryName}
//           </button>
//         ))}
//       </div>

//       <div className="mt-3 list-music">
//         <ul className="list-unstyled">
//           <li className="one">
//             <div className="info-one">
//               <a href="">
//                 <span className="number special-1">1</span>
//                 <img
//                   src="https://image-cdn.nct.vn/song/2024/11/16/3/6/e/7/1731692702127.jpg"
//                   alt=""
//                   />
//               </a>
//               <div className="d-flex flex-column mb-3">
//                 <p>
//                   <a href="">Màu Nước Mắt</a>
//                 </p>
//                 <span>RAP VIỆT, Hustlang Robber, Ngắn</span>
//               </div>
//             </div>
//           </li>
//           <li className="one">
//             <div className="info-one">
//               <a href="">
//                 <span className="number special-2">2</span>
//               </a>
//               <div className="d-flex flex-column mb-3">
//                 <p>
//                   <a href="">Màu Nước Uống</a>
//                 </p>
//                 <span>RAP VIỆT, Hustlang Robber, Ngắn</span>
//               </div>
//             </div>
//           </li>
//           <li className="one">
//             <div className="info-one">
//               <a href="">
//                 <span className="number special-3">3</span>
//               </a>
//               <div className="d-flex flex-column mb-3">
//                 <p>
//                   <a href="">Màu Nước Ngọt</a>
//                 </p>
//                 <span>RAP VIỆT, Hustlang Robber, Ngắn</span>
//               </div>
//             </div>
//           </li>

//           <li className="one">
//             <div className="info-one">
//               <a href="">
//                 <span className="number special-4">4</span>
//               </a>
//               <div className="d-flex flex-column mb-4">
//                 <p>
//                   <a href="">Màu Nước Ngọt</a>
//                 </p>
//                 <span>RAP VIỆT, Hustlang Robber, Ngắn</span>
//               </div>
//             </div>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// {/* <button
//   type="button"
//   className={`btn rounded-pill ${activeButton === "Âu Mỹ" ? "btn-danger" : ""}`}
//   onClick={() => setActiveButton("Âu Mỹ")}
// >
//   Âu Mỹ
// </button>
// <button
//   type="button"
//   className={`btn rounded-pill ${activeButton === "Hàn Quốc" ? "btn-danger" : ""}`}
//   onClick={() => setActiveButton("Hàn Quốc")}
// >
//   Hàn Quốc
// </button> */}