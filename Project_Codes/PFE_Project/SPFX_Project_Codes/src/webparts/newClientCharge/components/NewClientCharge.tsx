import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from "./NewClientCharge.module.scss";
const AOS = require("aos");
import "aos/dist/aos.css";

const NewClientCharge: React.FC = () => {
  const [activeTab, setActiveTab] = useState('partners');

  useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  return (
    <div className={styles.DashComp}>
      <div className={styles.headerDash}>
        <div className={styles.titleDash}>
          <h5 className={styles.titleTextDash}>Client And Monthly Charges Management Systemt</h5>
          <img src={require('../assets/logo-removebg-preview.png')} alt='logo' className={styles.logoImgDash} />
        </div>
        <div className={styles.navLinks}>
          <p className={`${styles.link} ${activeTab === 'partners' ? styles.active:null}`} onClick={() => setActiveTab('partners')}>New Client</p>
          <p className={`${styles.link} ${activeTab === 'create' ? styles.active:null}`} onClick={() => setActiveTab('create')}>New Charge</p>
        </div>
      </div>
      <div >
        {activeTab === 'partners' && (
          <div>1</div>
        )}

        {activeTab === 'create' && (
          <div>2</div>
        )}
      </div>
    </div>
  );
};

export default NewClientCharge;
