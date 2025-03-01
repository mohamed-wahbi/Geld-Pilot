import React, { useEffect, useState } from "react";
import "./vierge.css";
import logo from "../../../assets/logo-removebg-preview.png";
import { ToastContainer, toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlineWrench } from "react-icons/hi2";
import { VocaFlexMWSTn } from 'vecoflextnmws'

import axios from "axios";








const Vierge = () => {


  const [allFiltredDatas, setAllFiltredDatas] = useState([])
  const [oneFiltredData, setOneFiltredData] = useState({})

  console.log(allFiltredDatas);// liste des données filtre

  console.log(oneFiltredData)// un ligne de la liste des données filtré





  const getAllFiltredDatas = (datas) => { setAllFiltredDatas(datas) }
  const getOneFiltredData = (data) => {
    setOneFiltredData(data)
    if (oneFiltredData != {}) {
      alert("tu peux naviger")
    }

  }



  const [activeTab, setActiveTab] = useState("partners");
  const [clients, setClients] = useState([]);
  const [editableRow, setEditableRow] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [editedData, setEditedData] = useState({});

  // ------------------------------Create Client------------------------------------------------

  const [newClientData, setNewClientData] = useState(null); // Stocke le nouveau client

  // // Création d'un nouveau client (affichage d'une ligne vide)
  // const createNewClient = () => {
  //   setNewClientData({
  //     cin: "",
  //     name: "",
  //     email: "",
  //     phone: "",
  //     address: "",
  //     clientType: "Individual",
  //     paymentMethod: "Credit Card",
  //     currency: "Dollar",
  //   });
  // };


  // // Mise à jour des données du nouveau client
  // const handleNewClientChange = (e, field) => {
  //   setNewClientData((prev) => ({ ...prev, [field]: e.target.value }));
  // };

  // // Sauvegarde du nouveau client
  // const saveNewClient = async () => {
  //   if (!newClientData.name || !newClientData.cin || !newClientData.email) {
  //     toast.error("Veuillez remplir tous les champs obligatoires !");
  //     return;
  //   }

  //   try {
  //     await axios.post("http://127.0.0.1:3320/api/client/create", newClientData);
  //     toast.success("Client ajouté avec succès !");
  //     fetchClients();
  //     setNewClientData(null);
  //   } catch (error) {
  //     console.error("Erreur lors de la création du client :", error);
  //     toast.error("Erreur lors de la création du client !");
  //   }
  // };

  // _____________________________________________________________________________________________


  // Récupérer les clients
  const fetchClients = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3320/api/client/getAll");
      setClients(response.data.clients);
    } catch (error) {
      console.error("Erreur lors du fetching des clients :", error);
    }
  };

  // Mettre à jour un client
  const updateClient = async (id, updatedData) => {
    if (Object.keys(updatedData).length === 0) {
      toast.info("Aucune modification détectée !");
      return;
    }
    try {
      await axios.put(`http://127.0.0.1:3320/api/client/updateOne/${id}`, updatedData);
      toast.success("Client mis à jour avec succès !");
      fetchClients();

    } catch (error) {
      console.error("Erreur lors de la mise à jour du client :", error);
      toast.error("Erreur lors de la mise à jour du client !");
    }
  };

  const handleEditClick = (client) => {
    setEditableRow(client._id);
    setOriginalData(client); // Sauvegarde les données originales pour comparer les modifications
    setEditedData({}); // Réinitialiser editedData
  };

  const handleChange = (e, field) => {
    const value = e.target.value;

    // Comparer avec la valeur originale et mettre à jour uniquement si elle a changé
    if (value !== originalData[field]) {
      setEditedData((prev) => ({ ...prev, [field]: value }));
    } else {
      setEditedData((prev) => {
        const updated = { ...prev };
        delete updated[field]; // Supprimer le champ s'il est revenu à sa valeur initiale
        return updated;
      });
    }
  };

  const handleSave = () => {
    if (editableRow) {
      updateClient(editableRow, editedData);
      setEditableRow(null);
    }
  };


  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="DashComp">
      <div className="headerDash">
        <div className="titleDash">
          <h5 className="titleTextDash">Authorization Management</h5>
          <img src={logo} alt="logo" className="logoImgDash" />
        </div>
        <div className="navLinks">
          <p className={`link ${activeTab === "partners" ? "active" : ""}`} onClick={() => setActiveTab("partners")}>
            Client
          </p>
          <p className={`link ${activeTab === "create" ? "active" : ""}`} onClick={() => setActiveTab("create")}>
            Charge
          </p>
        </div>
      </div>

      <div className="authUserTable">


        <div className="HeaderTabelCtrl">
          <div className="searchInput">
            <VocaFlexMWSTn
              data={clients}
              keys={["name", "clientType", "currency", "status"]}
              lang={"en-US"}
              threshold={"0.3"}
              allFiltredDatas={getAllFiltredDatas}
              oneFiltredData={getOneFiltredData}
              titre={"name"}
              description={"clientType"}
            />
          </div>

          <div className="ctrlTabBtns">
            <button >🆕</button> {/*ajouter createNewClient function*/}
            <button>🔄️</button>
          </div>
        </div>






        {activeTab === "partners" && (
          <table className="table">
            <thead>
              <tr>
                <th>Controle</th>
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

              {/* Ligne pour ajouter un nouveau client en haut du tableau */}
              {/* {newClientData && (
                <tr>
                  <td>➕</td>
                  <td>
                    <input type="text" value={newClientData.cin} onChange={(e) => handleNewClientChange(e, "cin")} />
                  </td>
                  <td>
                    <input type="text" value={newClientData.name} onChange={(e) => handleNewClientChange(e, "name")} />
                  </td>
                  <td>
                    <input type="email" value={newClientData.email} onChange={(e) => handleNewClientChange(e, "email")} />
                  </td>
                  <td>
                    <input type="text" value={newClientData.phone} onChange={(e) => handleNewClientChange(e, "phone")} />
                  </td>
                  <td>
                    <input type="text" value={newClientData.address} onChange={(e) => handleNewClientChange(e, "address")} />
                  </td>
                  <td>
                    <select value={newClientData.clientType} onChange={(e) => handleNewClientChange(e, "clientType")}>
                      <option>Company</option>
                      <option>Individual</option>
                    </select>
                  </td>
                  <td>
                    <select value={newClientData.paymentMethod} onChange={(e) => handleNewClientChange(e, "paymentMethod")}>
                      <option>Bank Transfer</option>
                      <option>Credit Card</option>
                      <option>Cash</option>
                    </select>
                  </td>
                  <td>
                    <select value={newClientData.currency} onChange={(e) => handleNewClientChange(e, "currency")}>
                      <option>Dinar</option>
                      <option>Dollar</option>
                      <option>Euro</option>
                    </select>
                  </td>

                  <td>
                    <input placeholder="Data time auto" />
                  </td>
                  <td>
                    <select value={newClientData.status} onChange={(e) => handleNewClientChange(e, "status")}>
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Blocked</option>
                    </select>
                  </td>

                  <td>
                    <button onClick={saveNewClient}>💾 Save</button>
                    <button onClick={() => setNewClientData(null)}>❌ Cancel</button>
                  </td>
                </tr>
              )} */}



              {(allFiltredDatas.length > 0 ? allFiltredDatas : clients).map((client) => (
                <tr key={client._id}>
                  <td className="ctrlCl">
                    <span>⚙️</span>
                    <div className="ctrlBtn">
                      <MdDeleteOutline className="deleteLogo" />
                      <HiOutlineWrench className="updateLogo" onClick={() => handleEditClick(client)} />
                    </div>
                  </td>
                  <td>{client.cin}</td>
                  <td>
                    {editableRow === client._id ? (
                      <input type="text" defaultValue={client.name} onChange={(e) => handleChange(e, "name")} />
                    ) : (
                      client.name
                    )}
                  </td>


                  <td>
                    {editableRow === client._id ? (
                      <input type="email" defaultValue={client.email} onChange={(e) => handleChange(e, "email")} />
                    ) : (
                      <>📧 {client.email}</>
                    )}
                  </td>
                  <td>
                    {editableRow === client._id ? (
                      <input type="text" defaultValue={client.phone} onChange={(e) => handleChange(e, "phone")} />
                    ) : (
                      <>📱 {client.phone}</>
                    )}
                  </td>
                  <td>
                    {editableRow === client._id ? (
                      <input type="text" defaultValue={client.address} onChange={(e) => handleChange(e, "address")} />
                    ) : (
                      client.address
                    )}
                  </td>
                  <td>
                    <select defaultValue={client.clientType} onChange={(e) => handleChange(e, "clientType")} disabled={editableRow !== client._id}>
                      <option>Company</option>
                      <option>Individual</option>
                    </select>
                  </td>
                  <td>
                    <select defaultValue={client.paymentMethod} onChange={(e) => handleChange(e, "paymentMethod")} disabled={editableRow !== client._id}>
                      <option>Bank Transfer</option>
                      <option>Credit Card</option>
                      <option>Cash</option>
                    </select>
                  </td>
                  <td>
                    <select defaultValue={client.currency} onChange={(e) => handleChange(e, "currency")} disabled={editableRow !== client._id}>
                      <option>Dinar</option>
                      <option>Dollar</option>
                      <option>Euro</option>
                    </select>
                  </td>
                  <td>{client.createdAt}</td>
                  <td>
                    <select defaultValue={client.status} onChange={(e) => handleChange(e, "status")} disabled={editableRow !== client._id}>
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Blocked</option>
                    </select>
                  </td>
                  {editableRow === client._id && (
                    <td>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={() => setEditableRow(null)}>Cancel</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Vierge;
