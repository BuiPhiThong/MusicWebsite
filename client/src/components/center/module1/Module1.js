import React, { useEffect, useState } from "react";
import "./module1.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchModuleOneByType } from "../../../reducers/module1Slice";
const Module1 = () => {
  const dispatch = useDispatch();
  const { error, module1, loading } = useSelector((state) => state.moduleOne);

  const tid = "674841453731b7548151dbc6";
  useEffect(() => {
    dispatch(fetchModuleOneByType(tid));

       // Gọi lại API sau 1 phút (60000 ms = 1 phút)
       const intervalId = setInterval(() => {
        dispatch(fetchModuleOneByType(tid));
      }, 600000);  // Mỗi 1 phút
  
      // Cleanup: Hủy interval khi component bị unmount
      return () => clearInterval(intervalId);
  }, [dispatch, tid]);
  return (
    <div>
      <h3 className="center_1">Vũ Trụ Nhạc Việt</h3>
      {loading ? (
        <p className="text-danger">.....Loading</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul className="row gap-1 list-unstyled mt-3">
          {module1 && module1.length > 0 ? (
            module1.map((playlist, index) => (
              <li key={index} className="col-md-2">
                <div>
                  <a href="#">
                    <img
                      src={playlist.image} // Sử dụng trường image từ API
                      alt={playlist.name} // Sử dụng tên playlist làm alt cho ảnh
                    />
                  </a>
                </div>
                <div className="mt-2">{playlist.name}</div>
              </li>
            ))
          ) : (
            <p>No playlists found</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Module1;

{
  /* <li className="col-md-2">
            <div>
              <a href="">
                <img
                  src="https://avatar-ex-swe.nixcdn.com/playlist/2023/06/23/5/a/2/9/1687494883422_300.jpg"
                  alt=""
                />
              </a>
            </div>
            <div className="mt-2">Info</div>
          </li>
          <li className="col-md-2">
            <div>
              <a href="">
                <img
                  src="https://avatar-ex-swe.nixcdn.com/playlist/2023/06/23/5/a/2/9/1687494883422_300.jpg"
                  alt=""
                />
              </a>
            </div>
            <div className="mt-2">Info</div>
          </li>
          <li className="col-md-2">
            <div>
              <a href="">
                <img
                  src="https://avatar-ex-swe.nixcdn.com/playlist/2023/06/23/5/a/2/9/1687494883422_300.jpg"
                  alt=""
                />
              </a>
            </div>
            <div className="mt-2">Info</div>
          </li>
          <li className="col-md-2">
            <div>
              <a href="">
                <img
                  src="https://avatar-ex-swe.nixcdn.com/playlist/2023/06/23/5/a/2/9/1687494883422_300.jpg"
                  alt=""
                />
              </a>
            </div>
            <div className="mt-2">Info</div>
          </li> */
}
