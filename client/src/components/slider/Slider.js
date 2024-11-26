import React from "react";
import "./slider.css";

const Slider = () => {
  return (
    <div className="border mt-4">
      <div
        id="customSlider"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#customSlider"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#customSlider"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#customSlider"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>

        {/* Slides */}
        <div className="carousel-inner">
          {/* Slide 1 */}
          <div className="carousel-item active">
            <img
              src="https://avatar-ex-swe.nixcdn.com/slideshow/2024/11/26/a/5/b/f/1732591658122_org.jpg"
              className="d-block w-100 custom-slide-image"
              alt="Slide 1"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Gen Gì Gen</h5>
              <p>Exploring modern music trends.</p>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="carousel-item">
            <img
              src="https://avatar-ex-swe.nixcdn.com/slideshow/2024/11/26/a/5/b/f/1732591454167_org.jpg"
              className="d-block w-100 custom-slide-image"
              alt="Slide 2"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Rap Việt</h5>
              <p>Bản thu tập 10 đã chính thức phát hành.</p>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="carousel-item">
            <img
              src="https://avatar-ex-swe.nixcdn.com/slideshow/2024/11/25/4/f/b/8/1732509835346_org.jpg"
              className="d-block w-100 custom-slide-image"
              alt="Slide 3"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Nhắm Mắt, Bật Nhạc, Tắt Phone</h5>
              <p>Hồ Ngọc Hà</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#customSlider"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#customSlider"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Slider;
