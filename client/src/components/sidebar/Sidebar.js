import React, { useState } from "react";
import "./sidebar.css";

const Sidebar = () => {
  const [activeButton, setActiveButton] = useState("Việt Nam");

  return (
    <div>
      <h3 className="text-primary">BXH BÀI HÁT</h3>
      <div className="btn-group w-100" role="group">
        <button
          type="button"
          className={`btn rounded-pill ${activeButton === "Việt Nam" ? "btn-danger" : ""}`}
          onClick={() => setActiveButton("Việt Nam")}
        >
          Việt Nam
        </button>
        <button
          type="button"
          className={`btn rounded-pill ${activeButton === "Âu Mỹ" ? "btn-danger" : ""}`}
          onClick={() => setActiveButton("Âu Mỹ")}
        >
          Âu Mỹ
        </button>
        <button
          type="button"
          className={`btn rounded-pill ${activeButton === "Hàn Quốc" ? "btn-danger" : ""}`}
          onClick={() => setActiveButton("Hàn Quốc")}
        >
          Hàn Quốc
        </button>
      </div>

      <div className="mt-3 list-music">
        <ul className="list-unstyled">
          <li className="one">
            <div className="info-one">
              <a href="">
                <span className="number special-1">1</span>
                <img
                  src="https://image-cdn.nct.vn/song/2024/11/16/3/6/e/7/1731692702127.jpg"
                  alt=""
                />
              </a>
              <div className="d-flex flex-column mb-3">
                <p>
                  <a href="">Màu Nước Mắt</a>
                </p>
                <span>RAP VIỆT, Hustlang Robber, Ngắn</span>
              </div>
            </div>
          </li>
          <li className="one">
            <div className="info-one">
              <a href="">
                <span className="number special-2">2</span>            
              </a>
              <div className="d-flex flex-column mb-3">
                <p>
                  <a href="">Màu Nước Uống</a>
                </p>
                <span>RAP VIỆT, Hustlang Robber, Ngắn</span>
              </div>
            </div>
          </li>
          <li className="one">
            <div className="info-one">
              <a href="">
                <span className="number special-3">3</span>              
              </a>
              <div className="d-flex flex-column mb-3">
                <p>
                  <a href="">Màu Nước Ngọt</a>
                </p>
                <span>RAP VIỆT, Hustlang Robber, Ngắn</span>
              </div>
            </div>
          </li>

          <li className="one">
            <div className="info-one">
              <a href="">
                <span className="number special-4">4</span>              
              </a>
              <div className="d-flex flex-column mb-4">
                <p>
                  <a href="">Màu Nước Ngọt</a>
                </p>
                <span>RAP VIỆT, Hustlang Robber, Ngắn</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
