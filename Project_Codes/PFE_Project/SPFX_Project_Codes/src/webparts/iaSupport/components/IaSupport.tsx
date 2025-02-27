import * as React from 'react';
import styles from './IaSupport.module.scss';
const AOS = require("aos");
import "aos/dist/aos.css";

const IaSupport: React.FC = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  return (
    <div className={styles.IaSupport}>
      IaSupport
    </div>
  );
};

export default IaSupport;
