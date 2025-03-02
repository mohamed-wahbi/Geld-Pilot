import * as React from 'react';
import { useState } from 'react';
import styles from "./NewClientCharge.module.scss";
import Charge from './Childs/Charge';
import ClientComp from './Childs/Client';

const NewClientCharge: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('partners')
  return (
    <div className={styles.DashComp}>
      <div className={styles.headerDash}>
        <div className={styles.titleDash}>
          <h5 className={styles.titleTextDash}>
            Client And Monthly Charges Management System
          </h5>
          <img 
            src={require('../assets/logo-removebg-preview.png')} 
            alt='logo' 
            className={styles.logoImgDash} 
          />
        </div>
        <div className={styles.navLinks}>
          <p 
            className={`${styles.link} ${activeTab === 'partners' ? styles.active : ''}`} 
            onClick={() => setActiveTab('partners')}>
            New Client
          </p>
          <p 
            className={`${styles.link} ${activeTab === 'create' ? styles.active : ''}`} 
            onClick={() => setActiveTab('create')}>
            New Charge
          </p>
        </div>
      </div>
      <div className={styles.tableContainer}>
        {activeTab === 'partners' && <ClientComp />}
        {activeTab === 'create' && <Charge />}
      </div>
    </div>
  );
};
export default NewClientCharge