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
          <div className='socialIcon'><a href="https://www.linkedin.com/company/alight-consulting-gmbh/" target="_blank"><FaLinkedin /></a></div>
          <div className='socialIcon'><a href="https://www.xing.com/pages/alightconsultinggmbh" target="_blank"><FaXing /></a></div>
          <div className='socialIcon'><a href="https://www.youtube.com/@alightconsultinggmbh" target="_blank"><FaYoutube /></a>  </div>
          <div className='socialIcon'><a href="https://www.facebook.com/AlightConsultingGmbH" target="_blank"><FaFacebook /></a></div>
          <div className='socialIcon'><a href="https://x.com/i/flow/login?redirect_after_login=%2FAlightCon" target="_blank"><FaTwitter /></a></div>
          {/* links not suported by edge */}
        </div>
        <div className='alightLinks'>
          <a className='linkText' href="https://alight.eu/en/" target='_blank'>Home</a>
          <div className='bar'></div>
          <a className='linkText' href="https://alight.eu/en/solutions/"target='_blank'>Solutions</a>
          <div className='bar'></div>
          <a className='linkText' href="https://alight.eu/en/technologies/" target='_blank'>Technologies</a>
          <div className='bar'></div>
          <a className='linkText' href="https://alight.eu/en/references/" target='_blank'>References</a>
          <div className='bar'></div>
          <a className='linkText' href="https://alight.eu/en/about-us/" target='_blank'>About Us</a>
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
