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
                <tr>
                  <td>07498188</td>
                  <td style={{ textTransform: "capitalize", fontWeight: "500" }}>wahbi</td>
                  <td>📧 wahbi</td>
                  <td>📱 466156116</td>
                  <td> 20 Tunisia Bardo</td>
                  <td>
                    <select>
                      <option>Company</option>
                      <option>Individual</option>
                    </select>
                  </td>
                  <td>
                    <select>
                      <option>Bank Transfer</option>
                      <option>Credit Card</option>
                      <option>Cash</option>
                    </select>
                  </td>
                  <td>
                    <select>
                      <option>Dinar</option>
                      <option>Dollar</option>
                      <option>Euro</option>
                    </select>
                  </td>
                  <td>15/02/2023</td>
                  <td>
                    <select>
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Blocked</option>
                    </select>
                  </td>
                </tr>
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
