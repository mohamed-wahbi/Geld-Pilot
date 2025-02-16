import React from 'react';
import { FaLinkedin, FaXing, FaYoutube, FaFacebook, FaTwitter, FaHeart, FaCopyright } from 'react-icons/fa';
import './App.css';
import logo from './logo.png'
const Footer = () => {
  return (
    <div className='footerComp'>
      <div className='footerTop'>
        <div className='alightLogo'>
          <img src={logo} alt='Alight Logo' />
        </div>
        <div className='alightSocials'>
          <div className='socialIcon'><FaLinkedin /></div>
          <div className='socialIcon'><FaXing /></div>
          <div className='socialIcon'><FaYoutube /></div>
          <div className='socialIcon'><FaFacebook /></div>
          <div className='socialIcon'><FaTwitter /></div>
        </div>
        <div className='alightLinks'>
          <a className='linkText' href='#'>Home</a>
          <div className='bar'></div>
          <a className='linkText' href='#'>Solutions</a>
          <div className='bar'></div>
          <a className='linkText' href='#'>Technologies</a>
          <div className='bar'></div>
          <a className='linkText' href='#'>References</a>
          <div className='bar'></div>
          <a className='linkText' href='#'>About Us</a>
        </div>
      </div>
      <div className='footerBottom'>
        <h5>GELD PILOT platform, created with love <FaHeart className="heartIcon" /> by Salwej Med. Wahbi</h5>
        <p><FaCopyright /> All rights reserved</p>
      </div>
    </div>
  );
};

export default Footer;
