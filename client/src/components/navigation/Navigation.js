import React from "react";
import "./navigation.css";
import { CiSearch } from "react-icons/ci";
import { RiVipFill } from "react-icons/ri";
import { IoCloudDownloadOutline } from "react-icons/io5";

const Navigation = () => {
  return (
    // <div className="menu border d-flex justify-content-evenly align-items-center">
    //   <a className="logo" href="">
    //     <img
    //       src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT379f4qTjkZuhEyY4z270oLdoHGGAMRiKMsA&s"
    //       alt=""
    //     />
    //   </a>
    //     <ul className="d-flex gap-3 list-unstyled">
    //       <li className="mt-2">Khám phá</li>
    //       <li className="mt-2">Bài hát</li>
    //       <li className="mt-2">Playlist</li>
    //       <li className="mt-2">BXH</li>
    //     </ul>

    //     <ul className="d-flex gap-3 list-unstyled">
    //       <li className="mt-2">
    //         <div>
    //           <CiSearch className="fs-3" />
    //           <input
    //             className="rounded-pill"
    //             type="text"
    //             placeholder="tìm kiếm"
    //           />
    //         </div>
    //       </li>
    //       <RiVipFill className="fs-3 mt-2 text-danger" />
    //       <li className="mt-2">Đăng nhập</li>
    //       <li className="mt-2">Đăng kí</li>
    //     </ul>
    //   </div>
    <div className="row border align-items-center pt-3">
      <div className="col-md-6">
        <div className="menu_left">
          <ul className="d-flex gap-3 list-unstyled">
            <a className="logo" href="">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT379f4qTjkZuhEyY4z270oLdoHGGAMRiKMsA&s"
                alt=""
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
                <div>
                  <CiSearch className="fs-3" />
                  <input
                    className="rounded-pill"
                    type="text"
                    placeholder="tìm kiếm"
                  />
                </div>
              </li>
              <RiVipFill className="fs-3 mt-2 text-danger" />
            </ul>
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            <button className="btn btn-light mt-2 my-3 mx-3 rounded-pill">Đăng nhập</button>
            <button className="btn btn-primary mt-2 my-3 rounded-pill">Đăng kí</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;