import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from "./NewClientCharge.module.scss";
const AOS = require("aos");
import "aos/dist/aos.css";
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlineWrench } from "react-icons/hi2";
import axios from 'axios';

// ✅ Définition de l'interface Client
interface Client {
  id: string; // Ajoutez l'ID si nécessaire
  name: string;
  email: string;
  phone: string;
  address: string;
  clientType: string;
  paymentMethod: string;
  currency: string;
  registrationDate: string;
  status: string;
}

const NewClientCharge: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('partners');
  const [clients, setClients] = useState<Client[]>([]); // ✅ Ajout du type Client[]

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  // -----------------------------Get All Clients--------------------------------------------
  const fetchClients = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3320/api/client/getAll");
      setClients(response.data.clients); // ✅ Forçage du type si nécessaire
    } catch (error) {
      console.error("Erreur lors du fetching des clients :", error);
    }
  };



  //-------------------------------Format Date-----------------------------
  const pad = (n: number) => (n < 10 ? '0' + n : n.toString());

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Les mois commencent à 0
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className={styles.DashComp}>
      <div className={styles.headerDash}>
        <div className={styles.titleDash}>
          <h5 className={styles.titleTextDash}>Client And Monthly Charges Management System</h5>
          <img src={require('../assets/logo-removebg-preview.png')} alt='logo' className={styles.logoImgDash} />
        </div>
        <div className={styles.navLinks}>
          <p className={`${styles.link} ${activeTab === 'partners' ? styles.active : ''}`} onClick={() => setActiveTab('partners')}>New Client</p>
          <p className={`${styles.link} ${activeTab === 'create' ? styles.active : ''}`} onClick={() => setActiveTab('create')}>New Charge</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {activeTab === 'partners' && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Controls</th>
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
              {clients.map((client: Client, index: number) => ( // ✅ Ajout des types explicites
                <tr key={index}>
                  <td className={styles.ctrlCl}>
                    <span>⚙️</span>
                    <div className={styles.ctrlBtn}>
                      <MdDeleteOutline className={styles.deleteLogo} />
                      <HiOutlineWrench className={styles.updateLogo} />
                    </div>
                  </td>
                  <td>07498188</td>
                  <td style={{ textTransform: "capitalize", fontWeight: "500" }}>{client.name}</td>
                  <td>📧 {client.email}</td>
                  <td>📱 {client.phone}</td>
                  <td>{client.address}</td>
                  <td style={{ background: "rgb(247 247 247)" }}>
                    <select value={client.clientType} disabled>
                      <option>Company</option>
                      <option>Individual</option>
                    </select>
                  </td>
                  <td style={{ background: "rgb(247 247 247)" }}>
                    <select value={client.paymentMethod} disabled>
                      <option>Bank Transfer</option>
                      <option>Credit Card</option>
                      <option>Cash</option>
                    </select>
                  </td>
                  <td style={{ background: "rgb(247 247 247)" }}>
                    <select value={client.currency} disabled>
                      <option>Dinar</option>
                      <option>Dollar</option>
                      <option>Euro</option>
                    </select>
                  </td>
                  <td>{formatDate(client.registrationDate)}</td>
                  <td style={{ background: "rgb(247 247 247)" }}>
                    <select value={client.status} disabled>
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Blocked</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'create' && <div>Charge</div>}
      </div>
    </div>
  );
};

export default NewClientCharge;
