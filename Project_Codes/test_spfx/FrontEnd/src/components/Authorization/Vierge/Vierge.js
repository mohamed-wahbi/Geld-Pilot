import React, { useState } from 'react'
import './vierge.css'
import logo from "../../../assets/logo-removebg-preview.png"
import { ToastContainer, toast, Bounce } from 'react-toastify';




const Vierge = () => {
      const [activeTab, setActiveTab] = useState('partners');

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
          <p className={`link ${activeTab === 'partners' ? 'active' : ''}`} onClick={() => setActiveTab('partners')}>Partners</p>
          <p className={`link ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>Create User</p>
        </div>
      </div>

      <div className='authUserTable'>
        {activeTab === 'partners' && (
          <div>1</div>
        )}

        {activeTab === 'create' && (
          <div>2</div>
        )}
      </div>
    </div>
  )
}

export default Vierge
