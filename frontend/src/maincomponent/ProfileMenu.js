// src/components/ProfileMenu.js
import React from "react";
import "./ProfileMenu.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Switch from '@mui/material/Switch';


import slider2 from './images/sl1.webp';



const ProfileMenu = () => {
  return (
    <div className="profile-menu">
      <div className="profile-header">
        <img
          src={slider2}
          alt="Eden Smith"
          className="profile-image"
        />
        <h3 className="profile-name">Eden Smith</h3>
        <p className="profile-location">Los Angeles, CA</p>
      </div>

      <ul className="menu-list">
        <li className="menu-item">
          <AccountCircleIcon className="icon" /> My Account
        </li>
        <li className="menu-item">
          <ListAltIcon className="icon" /> My Order
        </li>
        <li className="menu-item">
          <FavoriteIcon className="icon" /> Wishlist
        </li>
        <hr />
        <li className="menu-item">
          <Brightness4Icon className="icon" /> Dark theme
          <Switch className="toggle-switch" />
        </li>
        <li className="menu-item">
          <HelpOutlineIcon className="icon" /> Help
        </li>
        <li className="menu-item">
          <ExitToAppIcon className="icon" /> Log out
        </li>
      </ul>
    </div>
  );
};

export default ProfileMenu;
