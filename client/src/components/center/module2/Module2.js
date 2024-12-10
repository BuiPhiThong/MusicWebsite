import React, { useEffect } from "react";
import "./module2.css";
import { useDispatch, useSelector } from "react-redux";
import { FaRegCirclePlay } from "react-icons/fa6";
import { fetchModuleTwoById } from "../../../reducers/module2Slice";

const Module2 = () => {
  const dispatch = useDispatch();
  const { module2, error, loading } = useSelector((state) => state.moduleTwo);

  const tid = "6748414d3731b7548151dbc8";
  useEffect(() => {
    dispatch(fetchModuleTwoById(tid));

    const setInterval = setTimeout(() => {
      dispatch(fetchModuleTwoById(tid));
    }, 600000);

    return () => clearInterval(setInterval);
  }, [dispatch, tid]);

  return (
    <div>
      <h3 className="center_1">Quốc Tế Nổi Bật</h3>
      {loading ? (
        <p className="text-danger">....Loading</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul className="row gap-1 list-unstyled mt-3">
          {module2?.map((playlist, index) => (
            <li key={index} className="col-md-2 playlist-item">
              <div className="image-container">
                <a href="#">
                  <img src={playlist.image} alt={playlist.name} />
                  <FaRegCirclePlay className="play-icon" />
                </a>
              </div>
              <div className="mt-2">{playlist.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Module2;
