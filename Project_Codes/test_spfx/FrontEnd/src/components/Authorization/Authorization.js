import React, { useState } from 'react';
import "./authorization.css";

import logo from "../../assets/logo-removebg-preview.png"

const Authorization = () => {
  const [activeTab, setActiveTab] = useState('partners');
  const [isclicked, setIsclicked] = useState(false);

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
                <tr>
                  <td>wahbi@gmail.com</td>
                  <td>Wahbi</td>
                  <td>23569874</td>
                  <td>Connected</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'create' && (
          <div className='CreatedUserTable'>

            <div className='CreatedUser'>
                
              <button className={isclicked?"addUserBtnLogo":"addUserBtnText"} onClick={()=>setIsclicked(!isclicked)}>{isclicked?"➕":"Create New"}</button>
              {isclicked?<input type='email' placeholder='Enter email of user' className='userInput' />:null}
            </div>


            <table className='table'>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Created At</th>
                  <th>Control</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>wahbi@gmail.com</td>
                  <td>12/02/2025</td>
                  <td><button className='control-btn delete'>🗑️delete</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Authorization;
