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
          <p className={`${styles.link} ${activeTab === 'partners' ? styles.active : null}`} onClick={() => setActiveTab('partners')}>New Client</p>
          <p className={`${styles.link} ${activeTab === 'create' ? styles.active : null}`} onClick={() => setActiveTab('create')}>New Charge</p>
        </div>
      </div>
      <div className={styles.tableContainer} >
        {activeTab === 'partners' && (
          <table className={styles.table}>
          <thead>
            <tr>
              <th>CIN</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Client Type</th>
              <th>Payment Method</th>
              <th>Used Currencies</th>
              <th>Registration Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>07498188</td>
              <td style={{ textTransform: "capitalize", fontWeight: "500" }}>wahbi</td>
              <td>📧 wahbi</td>
              <td>📱 466156116</td>
              <td> 20 Tunisia Bardo</td>
              <td style={{background: "rgb(247 247 247)"}}>
                <select>
                  <option>Company</option>
                  <option>Individual</option>
                </select>
              </td>
              <td style={{background: "rgb(247 247 247)"}}>
                <select >
                  <option>Bank Transfer</option>
                  <option>Credit Card</option>
                  <option>Cash</option>
                </select>
              </td>
              <td style={{background: "rgb(247 247 247)"}}>
                <select>
                  <option>Dinar</option>
                  <option>Dollar</option>
                  <option>Euro</option>
                </select>
              </td>
              <td>15/02/2023</td>
              <td style={{background: "rgb(247 247 247)"}}>
                <select>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Blocked</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        )}

        {activeTab === 'create' && (
          <div>Charge</div>
        )}
      </div>
    </div>
  );
};

export default NewClientCharge;
