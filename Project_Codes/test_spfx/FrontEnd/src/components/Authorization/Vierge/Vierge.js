import React, { useEffect, useState } from "react";
import "./vierge.css";
import logo from "../../../assets/logo-removebg-preview.png";
import { ToastContainer, toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlineWrench } from "react-icons/hi2";
import {VocaFlexMWSTn} from 'vecoflextnmws'

import axios from "axios";








const Vierge = () => {


  const [allFiltredDatas,setAllFiltredDatas] = useState([])
  const [oneFiltredData,setOneFiltredData] = useState({})

  console.log(allFiltredDatas);// liste des données filtre

  console.log(oneFiltredData)// un ligne de la liste des données filtré
  

  const getAllFiltredDatas = (datas) => { setAllFiltredDatas(datas) }
  const getOneFiltredData = (data) => { 
    setOneFiltredData(data)
    if(oneFiltredData!={}){
      alert("tu peux naviger")
    }

   }

  

  const [activeTab, setActiveTab] = useState("partners");
  const [clients, setClients] = useState([]);
  const [editableRow, setEditableRow] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [editedData, setEditedData] = useState({});

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


  const createNewClient = async()=> {
    try {
      const newClient = await axios.post("http://127.0.0.1:3320/api/client/create",newClientData)
      console.log(newClient.data.message)
      
    } catch (error) {
      console.log("error of creating Client!",error)
    }
  }




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
              keys={["name","clientType","currency","status"]}
              lang={"en-US"} 
              threshold={"0.3"} 
              allFiltredDatas={getAllFiltredDatas}
              oneFiltredData={getOneFiltredData}
              titre={"name"}
              description={"clientType"} 
            />
          </div>

          <div className="ctrlTabBtns">
            <button onClick={createNewClient}>🆕</button>
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
                  <td>{client.registrationDate}</td>
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
