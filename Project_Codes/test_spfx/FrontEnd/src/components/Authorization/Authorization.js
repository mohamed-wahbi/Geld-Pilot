import React, { useEffect, useState } from 'react';
import "./authorization.css";

import logo from "../../assets/logo-removebg-preview.png"
import axios from 'axios';

const Authorization = () => {
  const [userEmail,setUserEmail] = useState("")
  const [activeTab, setActiveTab] = useState('partners');
  const [isclicked, setIsclicked] = useState(false);
  const [Users,setUsers] = useState([]);
  const [AuthUsers,setAuthUsers] = useState([])

  useEffect(()=>{ featchAllUsers()},[])
  useEffect(()=>{ featchAllAuthorizedUsers()},[])

  


    // --------------------------------Create Authorization for User---------------------------
    const CreateUserAuthorization = async () => {
      try {
        const newUsersAuth = await axios.post("http://127.0.0.1:3320/api/authorization/create",{
          email:userEmail
        })
        console.log(newUsersAuth.data.message)
        setUserEmail("")
        featchAllAuthorizedUsers()
        featchAllUsers()
        
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
const deleteOneAuthUser = async (id) => {
  try {
    const deleteUser = await axios.delete(`http://127.0.0.1:3320/api/authorization/delete_one/${id}`)
    console.log(deleteUser.data.message)
    featchAllAuthorizedUsers()
    featchAllUsers()
  } catch (error) {
    console.log("error featching Users!", error)
  }
}
// ________________________________________________________________________


  return (
    <div className='authorizationComp'>
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
            <table className='table'>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Status</th>
              </tr>
              </thead>
              <tbody>
              {Users.map((user)=>{
                return(
                  <tr>
                    <td> {user.email} </td>
                    <td> {user.name} </td>
                    <td> {user.phone} </td>
                    <td> {user.isConnected === true?"Connected":"not connected"} </td>
                  </tr>
                )
              })}
                
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'create' && (
          <div className='CreatedUserTable'>

            <div className='CreatedUser'>
                
              <button className={isclicked?"addUserBtnLogo":"addUserBtnText"} onClick={()=>{setIsclicked(!isclicked) ; CreateUserAuthorization()}}>{isclicked?"➕":"Create New"}</button>
              {isclicked?<input type='email' placeholder='Enter email of user' className='userInput' value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} />:null}
            </div>


            <table className='table'>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Is Registred</th>
                  <th>Created At</th>
                  <th>Control</th>
                </tr>
              </thead>
              <tbody>
                {AuthUsers.map((user)=>{
                  return(
                    <tr>
                      <td> {user.authorizedEmail} </td>
                      <td>{user.isRegistred===true?"registred":"not Registred"}</td>
                      <td> {user.createdAt} </td>
                      <td><button className='control-btn delete'
                        onClick={()=>deleteOneAuthUser(user._id)}
                      >🗑️delete</button></td>
                    </tr>
                  )
                })}
                
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Authorization;
