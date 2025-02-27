import * as React from 'react';
import styles from './IaSupport.module.scss';
const AOS = require("aos");
import "aos/dist/aos.css";

const IaSupport: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('partners');

  React.useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);



  return (
    <div className={styles.DashComp}>
      {/* Header Section */}
      <div className={styles.headerDash}>
        <div className={styles.titleDash}>
          <h5 className={styles.titleTextDash}>AI Support Tools</h5>
          <img
            src={require("../assets/logo-removebg-preview.png")}
            alt="logo"
            className={styles.logoImgDash}
          />
        </div>

        {/* Navigation Tabs */}
        <div className={styles.navLinks}>
          <p className={activeTab === "partners" ? styles.link + " " + styles.active : styles.link}
            onClick={() => setActiveTab("partners")}>
            Smarty
          </p>
          <p className={activeTab === "create" ? styles.link + " " + styles.active : styles.link}
            onClick={() => setActiveTab("create")}>
            Geld-Bot
          </p>
        </div>

      </div>

     
    </div>
  );
};

export default IaSupport;
