import React, { useEffect, useState } from 'react';
import "./authorization.css";
import emailjs from "emailjs-com";
import logo from "../../assets/logo-removebg-preview.png"
import axios from 'axios';

import { ToastContainer, toast, Bounce } from 'react-toastify';


const Authorization = () => {

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



  const [userEmail, setUserEmail] = useState("")
  const [activeTab, setActiveTab] = useState('partners');
  const [isclicked, setIsclicked] = useState(false);
  const [Users, setUsers] = useState([]);
  const [AuthUsers, setAuthUsers] = useState([])

  useEffect(() => { featchAllUsers() }, [])
  useEffect(() => { featchAllAuthorizedUsers() }, [])




  // --------------------------------Create Authorization for User---------------------------
  const CreateUserAuthorization = async () => {
    try {
      const newUsersAuth = await axios.post("http://127.0.0.1:3320/api/authorization/create", {
        email: userEmail
      })
      console.log(newUsersAuth.data.message)
      setUserEmail("")
      handleSendEmail()
      featchAllAuthorizedUsers()
      featchAllUsers()
      notify()


    } catch (error) {
      console.log("error featching Users!", error)
    }
  }
  // ________________________________________________________________________




  // --------------------------------User get all---------------------------
  const featchAllUsers = async () => {
    try {
      const Users = await axios.get("http://127.0.0.1:3320/api/auth/get_all_users")
      console.log(Users.data.getAllUsers)
      setUsers(Users.data.getAllUsers)
    } catch (error) {
      console.log("error featching Users!", error)
    }
  }
  // ________________________________________________________________________


  // --------------------------------get all Authorized Users---------------------------
  const featchAllAuthorizedUsers = async () => {
    try {
      const AuthUsers = await axios.get("http://127.0.0.1:3320/api/authorization/get_all")
      console.log(AuthUsers.data.allAuthorizedUsers)
      setAuthUsers(AuthUsers.data.allAuthorizedUsers)
    } catch (error) {
      console.log("error featching Users!", error)
    }
  }
  // ________________________________________________________________________



  // --------------------------------Delete User---------------------------
  const deleteOneAuthUser = async (id, email) => {
    try {
      const deleteUser = await axios.delete(`http://127.0.0.1:3320/api/authorization/delete_one/${id}`)
      console.log(deleteUser.data.message)
      featchAllAuthorizedUsers()
      featchAllUsers()
      notify(`User and Authorization of this email [${email}], are successfully deleted.🗑️`)
    } catch (error) {
      notify(`User and Authorization of this email [${email}], are not deleted!`)

    }
  }
  // ________________________________________________________________________



  // --------------------------------Send outlook message to new Authorized User---------------------------
  const handleSendEmail = () => {
    const templateParams = {
      to_email: userEmail, // Adresse e-mail du client
      subject: "Access Granted to Alight MEA Financial Management Platform",
      outlook: userEmail
    };

    emailjs
      .send(
        "service_nbwbgga",
        "template_407a0vi",
        templateParams,
        "sLtkVi6zMmrpgZFJV"
      )
      .then((response) => {
        notify(`Outlook authorization message is successfully sended to the user [${userEmail}]. ✅ `)

      })
      .catch((error) => {
        notify(`Outlook authorization message not sended to the user [${userEmail}]. ⛔`)
      });
  }
  // ________________________________________________________________________



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



  // ------------------------------------Forme db Date-------------------------------
  const formatDate = (isoString) => {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  // ___________________________________________________________________________________






  return (
    <div className='authorizationComp'>
      <ToastContainer />
      <div className='header'>
        <div className='title'>
          <h5 className='titleText'>Authorization Management</h5>
          <img src={logo} alt='logo' className='logoImg' />
        </div>
        <div className='navLinks'>
          <p className={`link ${activeTab === 'partners' ? 'active' : ''}`} onClick={() => setActiveTab('partners')}>Partners</p>
          <p className={`link ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>Create User</p>
        </div>
      </div>

      <div className='authUserTable'>
        {activeTab === 'partners' && (
          <div className='PartenerTable'>

            {
              Users.length === 0 ? <p style={{ 'paddingTop': '5px', 'color': '#6a2929' }}>No users regstred in the data base!</p> : <table className='table'>
                <thead>
                  <tr>

                    <th>Name</th>
                    <th>Email</th>

                    <th>Phone</th>
                    <th>Status</th>

                  </tr>
                </thead>
                <tbody>
                  {Users.map((user) => {
                    return (
                      <tr key={user._id}>
                        <td style={{ "textTransform": "capitalize", "fontWeight": "500" }}> {user.name} </td>
                        <td> <a href={`mailto = ${user.email}`}>📧 {user.email}</a> </td>

                        <td><a href={`tel = ${user.phone}`}>📞 {user.phone}</a>  </td>
                        <td> {user.isConnected === true ? "✅" : "⛔"} </td>

                      </tr>
                    )
                  })}

                </tbody>
              </table>
            }

          </div>
        )}

        {activeTab === 'create' && (
          <div className='CreatedUserTable'>

            <div className='CreatedUser'>

              <button className={isclicked ? "addUserBtnLogo" : "addUserBtnText"} onClick={() => { setIsclicked(!isclicked); CreateUserAuthorization() }}>{isclicked ? "➕" : "Create New"}</button>
              {isclicked ? <input type='email' placeholder='Enter email of user' className='userInput' value={userEmail} onChange={(e) => setUserEmail(e.target.value)} /> : null}
            </div>


            {AuthUsers.length === 0 ? <p style={{ 'paddingTop': '5px', 'color': '#6a2929' }}>No authorized users, you can create one.</p> : <table className='table'>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Is Registred</th>
                  <th>Created At</th>
                  <th>Control</th>
                </tr>
              </thead>
              <tbody>
                {AuthUsers.map((user) => {
                  return (
                    <tr key={user._id}>
                      <td>📧 {user.authorizedEmail} </td>
                      <td>{user.isRegistred === true ? "✅" : "⛔"}</td>
                      <td> {formatDate(user.createdAt)} </td>
                      <td><button className='control-btn delete'
                        onClick={() => deleteOneAuthUser(user._id, user.authorizedEmail)}
                      >🗑️</button></td>
                    </tr>
                  )
                })}

              </tbody>
            </table>}

          </div>
        )}
      </div>
    </div>
  );
}

export default Authorization;
