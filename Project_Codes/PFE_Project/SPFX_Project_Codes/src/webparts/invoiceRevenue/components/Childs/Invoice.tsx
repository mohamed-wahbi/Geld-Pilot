import * as React from 'react';
import { useEffect, useState } from 'react'; const AOS = require("aos");
import "aos/dist/aos.css";
import styles from "../../components/InvoiceRevenue.module.scss";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlineWrench } from "react-icons/hi2";
const { VocaFlexMWSTn } = require('vecoflextnmws')




interface Invoice {
  _id: string;
  id_client: string
  montantInitial: string;
  remise: string;
  montantApresRemise: string;
  montantPaye: string;
  montantRestant: string;
  datePaiementEntreprise: string;
  datePaiementClient: string;
  createdAt: string;
  statut: string;
}

interface Client {
  _id: string,
  name: string
}




const Invoice: React.FC = () => {

  const [invoices, setInvoices] = useState<Invoice[]>([]); // ✅ Ajout du type Client[]
  const [clients, setClients] = useState<Client[]>([]); // ✅ Ajout du type Client[]

  const [editableRow, setEditableRow] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<Invoice>>({});
  const [originalData, setOriginalData] = useState<Partial<Invoice>>({});

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);


  // -----------------------------Get All Clients--------------------------------------------
  const fetchInvoices = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3320/api/invoice/getAll");
      setInvoices(response.data.invoices); // ✅ Forçage du type si nécessaire
    } catch (error) {
      console.error("Erreur in fetching of clients :", error);
    }
  };
  // _________________________________________________________________________________________

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
  const DeleteOneInvoice = async (id: string) => {
    try {
      await axios.delete(`http://127.0.0.1:3320/api/invoice/deleteOne/${id}`);
      fetchInvoices()
      notify('Client deleted successfully . ✅')
    } catch (error) {
      console.error("Erreur in delete of client !", error);
    }
  };
  // _________________________________________________________________________________________





  // -----------------------------Update One Client--------------------------------------------
  // Mettre à jour un client
  const updateInvoice = async (id: string, updatedData: Partial<Invoice>) => {
    if (Object.keys(updatedData).length === 0) {
      setEditableRow(null)
      notify("No changes detected ! 🤔");
      return;
    }
    try {
      await axios.put(`http://127.0.0.1:3320/api/invoice/updateOne/${id}`, updatedData);
      notify("Client updated successfully ! ✅");
      fetchInvoices();
      setEditableRow(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client :", error);
      notify("Erreur lors de la mise à jour du client !");
    }
  };

  const handleEditClick = (client: Invoice) => {
    setEditableRow(client._id);
    setOriginalData(client);
    setEditedData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Invoice) => {
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
      updateInvoice(editableRow, editedData);
    }
  };
  // _________________________________________________________________________________________







  // -----------------------Filter System--------------------------------
  const [allFiltredDatas, setAllFiltredDatas] = useState<Invoice[]>([])
  const [oneFiltredData, setOneFiltredData] = useState<Invoice | null>(null)

  console.log(allFiltredDatas);// liste des données filtre

  console.log(oneFiltredData)// un ligne de la liste des données filtré


  const getAllFiltredDatas = (data: Invoice[]) => { setAllFiltredDatas(data) }
  const getOneFiltredData = (data: Invoice) => { setOneFiltredData(data) }
  // ___________________________________________________________________





  // ------------------------------Create Client------------------------------------------------
  const [newInvoiceData, setNewInvoiceData] = useState<Partial<Invoice> | null>(null);

  // Création d'un nouveau client (affichage d'une ligne vide)
  const createNewInvoice = () => {
    setNewInvoiceData({
      id_client: "",
      montantInitial: "",
      remise: "",
      montantApresRemise: "",
      montantPaye: "",
      montantRestant: "",
      datePaiementEntreprise: "",
      datePaiementClient: "",
      createdAt: "",
      statut: ""
    })
  };

  // Mise à jour des données du nouveau client
  const handleNewInvoiceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Invoice
  ) => {
    setNewInvoiceData((prev) =>
      prev ? { ...prev, [field]: e.target.value } : null
    );
  };

  // Sauvegarde du nouveau client
  const saveNewInvoice = async () => {
    if (!newInvoiceData || !newInvoiceData.id_client || !newInvoiceData.montantInitial || !newInvoiceData.montantPaye) {
      notify("Veuillez remplir tous les champs obligatoires ! ⛔");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:3320/api/invoice/create", newInvoiceData);
      notify("Client Created successfully. ✅");
      fetchInvoices();
      setNewInvoiceData(null);
    } catch (error) {
      console.error("Erreur lors de la création du client :", error);
      notify("Erreur of creation client! ⛔");
    }
  };

  // _____________________________________________________________________________________________









  // ----------------------------------Notif Alert---------------------------------
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
  // _______________________________________________________________________________




  //-------------------------------Format Date-----------------------------
  // const pad = (n: number) => (n < 10 ? '0' + n : n.toString());

  // const formatDate = (isoString: string) => {
  //   const date = new Date(isoString);
  //   const day = pad(date.getDate());
  //   const month = pad(date.getMonth() + 1); // Les mois commencent à 0
  //   const year = date.getFullYear();
  //   const hours = pad(date.getHours());
  //   const minutes = pad(date.getMinutes());

  //   return `${day}/${month}/${year} ${hours}:${minutes}`;
  // };
  // ______________________________________________________________________________




  // ---------------------------Reload Btn----------------------------------
  const reloadInvoicesDatas = () => {
    fetchInvoices()
    notify("All clients reloaded from the Data Base. ✅")
  }
  // _______________________________________________________________________




  React.useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  return (
    <div className={styles.tableContainer}>
      <ToastContainer />

      <div className={styles.HeaderTabelCtrl}>
        <div className={styles.searchInput}>
          <VocaFlexMWSTn
            data={invoices}
            keys={["name"]}
            lang={"en-US"}
            threshold={"0.4"}
            allFiltredDatas={getAllFiltredDatas}
            oneFiltredData={getOneFiltredData}
            titre={"name"}
            description={"description"}
          />

        </div>

        <div className={styles.ctrlTabBtns}>
          <button onClick={createNewInvoice}>🆕</button>
          <button onClick={reloadInvoicesDatas}>🔄️</button>
        </div>
      </div>

      <div className={styles.TableContent}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Controller</th>
              <th>Client</th>
              <th>Initial Amount</th>
              <th>Discount (%)</th>
              <th>Amount After Discount</th>
              <th>Amount Paid</th>
              <th>Remaining Amount</th>
              <th>Company Payment Date</th>
              <th>Client Last Payment Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {/* Ligne pour ajouter un nouveau client en haut du tableau */}
            {newInvoiceData && (
              <tr>
                <td>➕</td>
                <td>
                  <select value={newInvoiceData.id_client} onChange={(e) => handleNewInvoiceChange(e, "id_client")}>
                    {
                      clients.map((client) => {
                        return (
                          <option> {client.name}</option>
                        )
                      })
                    }
                  </select>
                </td>
                <td>
                  <input className={styles.CreateInput} type="text" value={newInvoiceData.id_client} onChange={(e) => handleNewInvoiceChange(e, "id_client")} />
                </td>
                <td>
                  <input className={styles.CreateInput} type="text" value={newInvoiceData.montantInitial} onChange={(e) => handleNewInvoiceChange(e, "montantInitial")} />
                </td>
                <td>
                  <input className={styles.CreateInput} type="email" value={newInvoiceData.remise} onChange={(e) => handleNewInvoiceChange(e, "remise")} />
                </td>
                <td>
                  <input className={styles.CreateInput} type="text" value={newInvoiceData.montantApresRemise} onChange={(e) => handleNewInvoiceChange(e, "montantApresRemise")} />
                </td>
                <td>
                  <input className={styles.CreateInput} type="text" value={newInvoiceData.montantPaye} onChange={(e) => handleNewInvoiceChange(e, "montantPaye")} />
                </td>
                <td>
                  <input className={styles.CreateInput} type="text" value={newInvoiceData.montantRestant} onChange={(e) => handleNewInvoiceChange(e, "montantRestant")} />
                </td>

                <td>
                  <input className={styles.CreateInput} type="text" value={newInvoiceData.datePaiementEntreprise} onChange={(e) => handleNewInvoiceChange(e, "datePaiementEntreprise")} />
                </td>
                <td>
                  <input className={styles.CreateInput} type="text" value={newInvoiceData.datePaiementClient} onChange={(e) => handleNewInvoiceChange(e, "datePaiementClient")} />
                </td>
                <td>
                  <select value={newInvoiceData.statut} onChange={(e) => handleNewInvoiceChange(e, "statut")}>
                    <option>paid</option>
                    <option>unpaid</option>
                  </select>
                </td>

                <td className={styles.CreateRowStyle}>
                  <button style={{ border: "none", cursor: "pointer", background: "transparent" }} onClick={saveNewInvoice}>💾</button>
                  <button style={{ border: "none", cursor: "pointer", background: "transparent" }} onClick={() => setNewInvoiceData(null)}>❌</button>
                </td>
              </tr>
            )}






            {(allFiltredDatas.length != 0 ? allFiltredDatas : invoices).map((invoice) => (
              <tr key={invoice._id}>
                <td className={styles.ctrlCl}>
                  <span>⚙️</span>
                  <div className={styles.ctrlBtn}>
                    <MdDeleteOutline className={styles.deleteLogo} onClick={() => DeleteOneInvoice(invoice._id)} />
                    <HiOutlineWrench className={styles.updateLogo} onClick={() => handleEditClick(invoice)} />
                  </div>
                </td>
                <td>💳 {invoice.id_client}</td>
                <td>
                  {editableRow === invoice._id ? (
                    <input className={styles.ChangeInput} type="text" defaultValue={invoice.montantInitial} onChange={(e) => handleChange(e, "montantInitial")} />
                  ) : (
                    `🚹 ${invoice.montantInitial}`
                  )}
                </td>


                <td>
                  {editableRow === invoice._id ? (
                    <input className={styles.ChangeInput} type="email" defaultValue={invoice.remise} onChange={(e) => handleChange(e, "remise")} />
                  ) : (
                    `📧 ${invoice.remise}`
                  )}
                </td>
                <td>
                  {editableRow === invoice._id ? (
                    <input className={styles.ChangeInput} type="text" defaultValue={invoice.montantApresRemise} onChange={(e) => handleChange(e, "montantApresRemise")} />
                  ) : (
                    `📱 ${invoice.montantApresRemise}`
                  )}
                </td>
                <td>
                  {editableRow === invoice._id ? (
                    <input className={styles.ChangeInput} type="text" defaultValue={invoice.montantPaye} onChange={(e) => handleChange(e, "montantPaye")} />
                  ) : (
                    `📍 ${invoice.montantPaye}`
                  )}
                </td>

                <td>
                  {editableRow === invoice._id ? (
                    <input className={styles.ChangeInput} type="text" defaultValue={invoice.montantRestant} onChange={(e) => handleChange(e, "montantRestant")} />
                  ) : (
                    `📍 ${invoice.montantRestant}`
                  )}
                </td>

                <td>
                  {editableRow === invoice._id ? (
                    <input className={styles.ChangeInput} type="text" defaultValue={invoice.datePaiementEntreprise} onChange={(e) => handleChange(e, "datePaiementEntreprise")} />
                  ) : (
                    `📍 ${invoice.datePaiementEntreprise}`
                  )}
                </td>

                <td>
                  {editableRow === invoice._id ? (
                    <input className={styles.ChangeInput} type="text" defaultValue={invoice.datePaiementClient} onChange={(e) => handleChange(e, "datePaiementClient")} />
                  ) : (
                    `📍 ${invoice.datePaiementClient}`
                  )}
                </td>




                <td>
                  {editableRow === invoice._id ? (
                    <select defaultValue={invoice.statut} onChange={(e) => handleChange(e, "statut")}>
                      <option value="paid">paid</option>
                      <option value="unpaid">unpaid</option>
                    </select>
                  ) : (
                    invoice.statut
                  )}
                </td>

                {editableRow === invoice._id ? (
                  <td className={styles.editRow}>
                    <button onClick={handleSave} >✅</button>
                    <button onClick={() => setEditableRow(null)}>⛔</button>
                  </td>
                ) : null}

              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  );
};

export default Invoice;
