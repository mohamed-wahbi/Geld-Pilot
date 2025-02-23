import * as React from 'react';
import styles from './Authorization.module.scss';
import { FaLinkedin, FaXing, FaYoutube, FaFacebook, FaTwitter, FaHeart, FaCopyright } from 'react-icons/fa';
const AOS = require("aos");
import "aos/dist/aos.css";

const Footer: React.FC = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  return (
    <div>

    </div>
  );
};

export default Footer;
