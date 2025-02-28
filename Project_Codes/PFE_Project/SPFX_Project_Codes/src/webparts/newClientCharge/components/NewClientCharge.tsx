import * as React from 'react';
import styles from './NewClientCharge.module.scss';
const AOS = require("aos");
import "aos/dist/aos.css";

const NewClientCharge: React.FC = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  return (
    <div className={styles.NewClientChargeComp}>
        NewClientChargeComp
    </div>
  );
};

export default NewClientCharge;
