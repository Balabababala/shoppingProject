// import React, { useState, useRef, useEffect } from "react";
// import '../css/ProductImageGallery.css';
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";

// const images = [
//   "https://via.placeholder.com/600x600.png?text=主圖1",
//   "https://via.placeholder.com/600x600.png?text=主圖2",
//   "https://via.placeholder.com/600x600.png?text=主圖3",
//   "https://via.placeholder.com/600x600.png?text=主圖4",
//   "https://via.placeholder.com/600x600.png?text=主圖5",
// ];

// export default function ProductImageGallery() {
//   const [nav1, setNav1] = useState(null);
//   const [nav2, setNav2] = useState(null);

//   const slider1 = useRef(null);
//   const slider2 = useRef(null);

//   useEffect(() => {
//     setNav1(slider1.current);
//     setNav2(slider2.current);
//   }, []);

//   const mainSettings = {
//     asNavFor: nav2,
//     ref: slider1,
//     arrows: true,
//     fade: true,
//     infinite: true,
//   };

//   const thumbSettings = {
//     asNavFor: nav1,
//     ref: slider2,
//     slidesToShow: 5,
//     swipeToSlide: true,
//     focusOnSelect: true,
//     vertical: true,
//     infinite: true,
//     arrows: false,
//     centerMode: true,
//     centerPadding: "0px",
//     // 根據你的需求調整高度與間距
//   };

//   return (
//     <div style={{ display: "flex", gap: "10px", maxWidth: 700 }}>
//       <div style={{ flex: 1 }}>
//         <Slider {...mainSettings}>
//           {images.map((img, idx) => (
//             <div key={idx}>
//               <img
//                 src={img}
//                 alt={`商品主圖 ${idx + 1}`}
//                 style={{ width: "100%", height: "auto", borderRadius: 8 }}
//               />
//             </div>
//           ))}
//         </Slider>
//       </div>

//       <div style={{ width: 100 }}>
//         <Slider {...thumbSettings}>
//           {images.map((img, idx) => (
//             <div key={idx} style={{ padding: "5px" }}>
//               <img
//                 src={img}
//                 alt={`商品縮圖 ${idx + 1}`}
//                 style={{
//                   width: "100%",
//                   height: 80,
//                   objectFit: "cover",
//                   borderRadius: 6,
//                   cursor: "pointer",
//                   border: "2px solid transparent",
//                 }}
//                 // slick 自動加上 .slick-current 樣式，你可以用 css 自訂選中效果
//               />
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </div>
//   );
// }
