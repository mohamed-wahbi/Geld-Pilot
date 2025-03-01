import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from "./NewClientCharge.module.scss";
const AOS = require("aos");
import "aos/dist/aos.css";
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlineWrench } from "react-icons/hi2";
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Définition de l'interface Client
interface Client {
  _id: string; // Ajoutez l'ID si nécessaire
  cin: string
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
  const [editableRow, setEditableRow] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<Partial<Client>>({});
  const [editedData, setEditedData] = useState<Partial<Client>>({});


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
      console.error("Erreur in fetching of clients :", error);
    }
  };
// _________________________________________________________________________________________



// -----------------------------Delete One Client--------------------------------------------
const DeleteOneClient = async (id:string) => {
  try {
    await axios.delete(`http://127.0.0.1:3320/api/client/deleteOne/${id}`);
    fetchClients()
    notify('Client deleted successfully . ✅')
  } catch (error) {
    console.error("Erreur in delete of client !", error);
  }
};
// _________________________________________________________________________________________


// -----------------------------Update One Client--------------------------------------------
// Mettre à jour un client
const updateClient = async (id: string, updatedData: Partial<Client>) => {
  if (Object.keys(updatedData).length === 0) {
    setEditableRow(null)
    notify("No changes detected ! 🤔" );
    return;
  }
  try {
    await axios.put(`http://127.0.0.1:3320/api/client/updateOne/${id}`, updatedData);
    notify("Client updated successfully ! ✅");
    fetchClients();
    setEditableRow(null);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client :", error);
    notify("Erreur lors de la mise à jour du client !");
  }
};

const handleEditClick = (client: Client) => {
  setEditableRow(client._id);
  setOriginalData(client);
  setEditedData({});
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Client) => {
  const value = e.target.value;
  if (value !== originalData[field]) {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  } else {
    setEditedData((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  }
};

const handleSave = () => {
  if (editableRow) {
    updateClient(editableRow, editedData);
  }
};
// _________________________________________________________________________________________





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
// ______________________________________________________________________________



const notify = (text: string) => toast(text, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Bounce,
  });





  return (
    <div className={styles.DashComp}>
            <ToastContainer />
      
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
            {clients.map((client) => (
              <tr key={client._id}>
                <td className={styles.ctrlCl}>
                  <span>⚙️</span>
                  <div className={styles.ctrlBtn}>
                    <MdDeleteOutline className={styles.deleteLogo} onClick={() => DeleteOneClient(client._id)} />
                    <HiOutlineWrench className={styles.updateLogo} onClick={() => handleEditClick(client)} /> 
                  </div>
                </td>
                <td>💳 {client.cin}</td>
                <td>
                  {editableRow === client._id ? (
                    <input className={styles.ChangeInput} type="text" defaultValue={client.name} onChange={(e) => handleChange(e, "name")} />
                  ) : (
                    `🚹 client.name`
                  )}
                </td>


                <td>
                  {editableRow === client._id ? (
                    <input className={styles.ChangeInput} type="email" defaultValue={client.email} onChange={(e) => handleChange(e, "email")} />
                  ) : (
                    `📧 client.email`
                  )}
                </td>
                <td>
                  {editableRow === client._id ? (
                    <input className={styles.ChangeInput} type="text" defaultValue={client.phone} onChange={(e) => handleChange(e, "phone")} />
                  ) : (
                    `📱 ${client.phone}`
                  )}
                </td>
                <td>
                  {editableRow === client._id ? (
                    <input className={styles.ChangeInput} type="text" defaultValue={client.address} onChange={(e) => handleChange(e, "address")} />
                  ) : (
                    `📍 client.address`
                  )}
                </td>
                <td>
                  {editableRow === client._id ? (
                    <select defaultValue={client.clientType} onChange={(e) => handleChange(e, "clientType")}>
                      <option value="Company">Company</option>
                      <option value="Individual">Individual</option>
                    </select>
                  ) : (
                    client.clientType
                  )}
                </td>
                <td>
                  {editableRow === client._id ? (
                    <select defaultValue={client.paymentMethod} onChange={(e) => handleChange(e, "paymentMethod")}>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Cash">Cash</option>
                    </select>
                  ) : (
                    client.paymentMethod
                  )}
                </td>
                <td>
                  {editableRow === client._id ? (
                    <select defaultValue={client.currency} onChange={(e) => handleChange(e, "currency")}>
                      <option value="Dinar">Dinar</option>
                      <option value="Dollar">Dollar</option>
                      <option value="Euro">Euro</option>
                    </select>
                  ) : (
                    client.currency
                  )}
                </td>
                <td>📆 {formatDate(client.registrationDate)}</td>
                <td>
                  {editableRow === client._id ? (
                    <select defaultValue={client.status} onChange={(e) => handleChange(e, "status")}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  ) : (
                    client.status
                  )}
                </td>
                
                {editableRow === client._id ? (
                    <td className={styles.editRow}>
                      <button onClick={handleSave} >✅</button>
                      <button onClick={() => setEditableRow(null)}>⛔</button>
                    </td>
                  ):null}
                
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
