import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";

const MenuFlipbook = () => {
  const bookRef = useRef();

  return (
    <div className="flipbook-wrapper">
      <HTMLFlipBook
        width={500}
        height={650}
        size="stretch"
        minWidth={300}
        maxWidth={600}
        maxHeight={800}
        showCover={true}
        mobileScrollSupport={true}
        ref={bookRef}
        className="flipbook"
      >
        {/* Page 1 - Starters */}
        <div className="menu-page">
          <h2>Starters</h2>
          <ul>
            <li>Tomato Soup ........ ₹120</li>
            <li>Paneer Tikka ........ ₹180</li>
            <li>Veg Spring Roll ...... ₹160</li>
            <li>Cheese Balls ........ ₹150</li>
          </ul>
        </div>

        {/* Page 2 - Main Course */}
        <div className="menu-page">
          <h2>Main Course</h2>
          <ul>
            <li>Paneer Butter Masala ...... ₹240</li>
            <li>Dal Makhani ................ ₹200</li>
            <li>Veg Biryani ................ ₹220</li>
            <li>Butter Naan (2 pcs) ........ ₹60</li>
          </ul>
        </div>

        {/* Page 3 - Desserts */}
        <div className="menu-page">
          <h2>Desserts</h2>
          <ul>
            <li>Gulab Jamun (2 pcs) ....... ₹80</li>
            <li>Rasmalai .................. ₹100</li>
            <li>Ice Cream (Scoop) ........ ₹90</li>
            <li>Fruit Custard ............ ₹110</li>
          </ul>
        </div>
      </HTMLFlipBook>
    </div>
  );
};

export default MenuFlipbook;
