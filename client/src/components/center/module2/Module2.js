import React, { useEffect } from "react";
import "./module2.css";
import { useDispatch, useSelector } from "react-redux";
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
      { loading ? (
        <p className="text-danger">....Loading</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul className="row gap-1 list-unstyled mt-3">
          {
            module2?.map((playlist,index)=>(
              <li key={index} className="col-md-2">
              <div>
                <a href="#">
                  <img
                    src={playlist.image}
                    alt={playlist.name}
                  />
                </a>
              </div>
              <div className="mt-2">{playlist.name}</div>
            </li>
            ))
          }
        </ul>
      )}
    </div>
  );
};

export default Module2;

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
