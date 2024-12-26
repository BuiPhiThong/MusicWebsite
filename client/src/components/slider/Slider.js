import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./slider.css";

const Slider = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const slides = [
    {
      image:
        "https://image.tienphong.vn/600x315/Uploaded/2024/mdf-vowsxr/2024_07_03/anh-trai-say-hi-duong-domic-ava-6661.jpg",
      title: "Mất Kết Nối-Dương Quá",
      description: "Exploring modern music trends.",
    },
    {
      image:
        "https://avatar-ex-swe.nixcdn.com/slideshow/2024/11/26/a/5/b/f/1732591454167_org.jpg",
      title: "Rap Việt",
      description: "Bản thu tập 10 đã chính thức phát hành.",
    },
    {
      image:"https://images.kienthuc.net.vn/zoom/800/Uploaded/quocquan/2024_06_03/so_tung_RSVV.jpg",
      title: "Đừng Làm Trái Tim Anh Đau",
      description: "Sơn Tùng M-TP",
    },
  ];

  return (
    <div className="slider-container mt-4">
      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={5000}
        keyBoardControl
        showDots
        containerClass="carousel-container"
        itemClass="carousel-item-padding-40-px"
      >
        {slides.map((slide, index) => (
          <div key={index} className="custom-slide">
            <img
              src={slide.image}
              alt={slide.title}
              className="custom-slide-image"
            />
            <div className="custom-slide-content">
              <h5>{slide.title}</h5>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;
