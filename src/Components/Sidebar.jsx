import React, { useState } from 'react'
import {AiFillCloseCircle, AiFillHome, AiOutlineFullscreenExit, AiOutlineHome, AiOutlineMenu} from 'react-icons/ai'
import '../css/sidebar.css';
import { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { MdExitToApp } from 'react-icons/md';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import favIcon from '../assets/favicon.png'
import client from '../sanityClient';
import { v4 as uuidv4 } from "uuid";

const Sidebar = () => {
  const [selectedItem, setSelectedItem] = useState(-1);
  const [visibility, setvisibility] = useState("mediumSizeSidebar");
  const [slideDirection, setSlideDirection] = useState("close");
  const [isOpen, setIsOpen] = useState(false);
  const [count , setCount] = useState(0);

  const showSidebar = () => {
    setIsOpen(true);
    console.log("Showing sidebar");
    setvisibility("openSidebar");
  };

  const closeSidebar = () => {
    console.log("closing Sidebar ");
    setvisibility("mediumSizeSidebar");
    setIsOpen(false);
  };

  const logoutUser = () => {
    const toastId = toast.loading("Loading...");

    localStorage.removeItem("user");

    toast.update(toastId, {
      render: "User Logout SuccessFull....",
      type: "success",
      isLoading: false,
      autoClose: 3000, // Close after 3 seconds
      closeOnClick: true,
    });

    window.location.reload("/");
  };

  /**Creating array of the categories , so that it can be fetched dynamiccaly */

  const arr = [
    "Walpaper",
    "Nature",
    "Food",
    "Travel",
    "People",
    "Technology",
    "Business",
    "Fashion",
    "Fitness",
    "Architecture",
    "Abstract",
  ];

  function handleSelectedItem(item, index) {
    setSelectedItem(index);
    /**Here would be the code to change the value for the feed section */
  }

  /**------------------------------------------------------------------ */

  
  /**---------------------------------------------------------------- */

  return (
    <div className="sidebarContainer">
      <div className="mobileScreenSidebar">
        <AiOutlineMenu onClick={showSidebar} className="menu" />

        <div className="mobileSidebarTop">
          <img src={favIcon} className="AppLogo" alt="" />
          <p className="logoText">ShotZ</p>
        </div>
      </div>

      <div className={` ${visibility} ${isOpen ? "open" : "close"}`}>
        <div className="sidebarTop">
          <img src={favIcon} className="AppLogo" alt="" />
          <p className="logoText">ShotZ</p>
          <AiFillCloseCircle
            size={30}
            className="closeCircle"
            onClick={closeSidebar}
          />
        </div>

        <ul>
          <li className="list ">
            <NavLink
              key="key"
              class="navLink"
              to="/"
              className={({ isActive }) => (isActive ? "selected" : "navLink")}
            >
              <AiFillHome />
              {"   "}
              Home
            </NavLink>
          </li>
        </ul>

        <p style={{"fontWeight":"bold" , "textAlign":"center" , "fontSize":"18px" , "color":"darkred"}}>Categories</p>

        <ul>
          {arr.map((item, index) => {
            return (
              <li className="list">
                <NavLink
                  key={item}
                  to={`/category/${item}`}
                  className={({ isActive }) =>
                    isActive ? "selected" : "navLink"
                  }
                  onClick={() => {
                    handleSelectedItem(item, index);
                  }}
                >
                  {item}
                </NavLink>
              </li>
            );
          })}
        </ul>

      
        <button type="button" className="logout" onClick={logoutUser}>
          Log Out <MdExitToApp className="logOutUserIcon" />
        </button>
      </div>
    </div>
  );
}

export default Sidebar
