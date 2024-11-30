import React, { useEffect } from "react";
import "./module3.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchModuleThreeById } from "../../../reducers/module3Slice";
const Module3 = () => {
  const dispatch = useDispatch()
  const {loading, error , module3} = useSelector((state)=> state.moduleThree)

  const tid='674841523731b7548151dbca'
  useEffect(()=>{
    dispatch(fetchModuleThreeById(tid))

    const setInterval = setTimeout(()=>{
      dispatch(fetchModuleThreeById(tid))
    },600000)


    return () => clearInterval(setInterval)
  },[dispatch,tid])
  return (
    <div>
      <h3 className="center_1">Tâm Trạng Hôm Nay</h3>
      { loading ? (
        <p className="text-danger">....Loading</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul className="row gap-1 list-unstyled mt-3">
          {
            module3?.map((playlist,index)=>(
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

export default Module3;

{/* <li className="col-md-2">
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
</li> */}