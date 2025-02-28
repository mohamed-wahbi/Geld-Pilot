import React, { useEffect, useState } from 'react'
import './vierge.css'
import logo from "../../../assets/logo-removebg-preview.png"
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlineWrench } from "react-icons/hi2";
import axios from 'axios';





const Vierge = () => {
  const [activeTab, setActiveTab] = useState('partners');
  const [clients, setClients] = useState([])
  useEffect(() => {
    fetchClients()
  }, [])

  // ------------------Token Maneg-----------------------------
  // const token = localStorage.getItem("token");
  // const [isAdmin, setIsAdmin] = useState(null);

  // useEffect(() => {
  //   if (token != null) {
  //     setIsAdmin(JSON.parse(atob(token.split(".")[1])).isAdmin);
  //     if (isAdmin === false) {
  //       notify("Only admin can access to this page!")
  //       window.location.href = "login";
  //     }
  //   }
  //   if (token == null) {
  //     notify("Only admin can access to this page!")
  //     window.location.href = "login";
  //   }
  // }, [token, isAdmin]);
  // _________________________________________________________________


  const fetchClients = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3320/api/client/getAll");
      setClients(response.data.clients)
    } catch (error) {
      console.error("Erreur lors du fetching des clients :", error);
    }
  };





































  // ----------------------------react-toastify config-------------------------
  const notify = (text) => toast(text, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
  // ______________________________________________________________________________



  return (
    <div className='DashComp'>
      <div className='headerDash'>
        <div className='titleDash'>
          <h5 className='titleTextDash'>Authorization Management</h5>
          <img src={logo} alt='logo' className='logoImgDash' />
        </div>
        <div className='navLinks'>
          <p className={`link ${activeTab === 'partners' ? 'active' : ''}`} onClick={() => setActiveTab('partners')}>Client</p>
          <p className={`link ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>Charge</p>
        </div>
      </div>

      <div className='authUserTable'>
        {activeTab === 'partners' && (
          <div>

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
                {clients.map((client) => {
                  return (
                    <tr key={client._id}>
                      <td className='ctrlCl'><span>⚙️</span><div className='ctrlBtn'><MdDeleteOutline className='deleteLogo' /><HiOutlineWrench className='updateLogo' /></div></td>
                      <td> {client.cin} </td>
                      <td style={{ textTransform: "capitalize", fontWeight: "500" }}> {client.name} </td>
                      <td>📧 {client.email} </td>
                      <td>📱 {client.phone} </td>
                      <td> {client.address} </td>
                      <td>
                        <select value={client.clientType}>
                          <option>Company</option>
                          <option>Individual</option>
                        </select>
                      </td>
                      <td>
                        <select value={client.paymentMethod}>
                          <option>Bank Transfer</option>
                          <option>Credit Card</option>
                          <option>Cash</option>
                        </select>
                      </td>
                      <td>
                        <select value={client.currency}>
                          <option>Dinar</option>
                          <option>Dollar</option>
                          <option>Euro</option>
                        </select>
                      </td>
                      <td> {client.registrationDate} </td>
                      <td>
                        <select value={client.status}>
                          <option>Active</option>
                          <option>Inactive</option>
                          <option>Blocked</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}


              </tbody>
            </table>



          </div>
        )}

        {activeTab === 'create' && (
          <div>2</div>
        )}
      </div>
    </div>
  )
}

export default Vierge
