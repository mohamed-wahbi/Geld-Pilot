import * as React from 'react';
import styles from '../../components/InvoiceRevenue.module.scss';
const AOS = require("aos");
import "aos/dist/aos.css";

const RevenueWebPart: React.FC = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  return (
    <div className={styles.revenueWebPart}>
      Ravenue Web Part .
    </div>
  );
};

export default RevenueWebPart;
