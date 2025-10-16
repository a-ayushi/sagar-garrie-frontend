import React from "react";
import MenuFlipbook from "../components/MenuFlipbook";
import "../styles/menu.css";

const Menu = () => {
  return (
    <div className="menu-container">
      <div className="menu-overlay-nav">
        <span>Starters</span>
        <span>Main Course</span>
        <span>Desserts</span>
      </div>
      <MenuFlipbook />
    </div>
  );
};

export default Menu;
