import * as React from 'react';
import styles from '../../components/Historys.module.scss';

const AOS = require("aos");
import "aos/dist/aos.css";

const ChargeHistoryTab: React.FC = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  return (
   <div className={styles.tableContainer}>
        Charges
   </div>
  );
};

export default ChargeHistoryTab;
