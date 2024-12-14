import React, { useEffect } from "react";
import "./module1.css";
import { useDispatch, useSelector } from "react-redux";
import { FaRegCirclePlay } from "react-icons/fa6";
import { createSlug } from "../../../ultils/helper";
import { fetchModuleOneByType } from "../../../reducers/module1Slice";

const Module1 = () => {
  const dispatch = useDispatch();
  const { error, module1, loading } = useSelector((state) => state.moduleOne);

  const tid = "674841453731b7548151dbc6";
  useEffect(() => {
    dispatch(fetchModuleOneByType(tid));

    // Gọi lại API sau 10 phút (600000 ms)
    const intervalId = setInterval(() => {
      dispatch(fetchModuleOneByType(tid));
    }, 600000);

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
              <li key={index} className="col-md-2 playlist-item">
                <div className="image-container">
                  <a href={`/danh-sach/${playlist.slug}`}>
                    <img
                      src={playlist.image} // Sử dụng trường image từ API
                      alt={playlist.name} // Sử dụng tên playlist làm alt cho ảnh
                    />
                    <FaRegCirclePlay className="play-icon" />

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
