import * as React from 'react';
import styles from './Authorization.module.scss';
// const AOS = require("aos");
import "aos/dist/aos.css";
// import { useEffect, useState } from 'react';
import axios from 'axios';


// Define a type for the users and authorized users (if needed for type safety)
interface User {
  name: string;
  email: string;
  phone: string;
  status: string;
}

// Define a type for the token payload (optional, depending on your JWT structure)
// interface TokenPayload {
//   isAdmin: boolean;
// }

const Authorization: React.FC = () => {
  // const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // useEffect(() => {
  //   AOS.init({ duration: 1500, once: true });

  //   const token = localStorage.getItem("token");

  //   if (token) {
  //     try {
  //       // Decode the token and extract the isAdmin property
  //       const decoded: TokenPayload = JSON.parse(atob(token.split(".")[1]));
  //       setIsAdmin(decoded.isAdmin);

  //       // Redirect if the user is not an admin
  //       if (decoded.isAdmin === false) {
  //         alert("Only admin can access to this page!");
  //         window.location.href = "https://alightconsulting.sharepoint.com/sites/GeldPilot/SitePages/Login.aspx";
  //       }
  //     } catch (error) {
  //       console.error("Error decoding token", error);
  //       alert("Invalid token, please login again!");
  //       window.location.href = "https://alightconsulting.sharepoint.com/sites/GeldPilot/SitePages/Login.aspx";
  //     }
  //   } else {
  //     alert("Only admin can access to this page!");
  //     window.location.href = "https://alightconsulting.sharepoint.com/sites/GeldPilot/SitePages/Login.aspx";
  //   }
  // }, []);


  const [userEmail, setUserEmail] = React.useState<string>('');
  const [activeTab, setActiveTab] = React.useState<string>('partners');
  const [isClicked, setIsClicked] = React.useState<boolean>(false);
  const [users,setUsers] = React.useState<User[]>([]);
  const [authUsers,setAuthUsers] = React.useState<User[]>([]);
  


  React.useEffect(() => { featchAllUsers() }, [])
  React.useEffect(() => { featchAllAuthorizedUsers() }, [])




  // ------------------------------Create Authorization for User---------------------------
  const CreateUserAuthorization = async () => {
    try {
      const newUsersAuth = await axios.post("http://127.0.0.1:3320/api/authorization/create", {
        email: userEmail
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
  const deleteOneAuthUser = async (id, email) => {
    try {
      const deleteUser = await axios.delete(`http://127.0.0.1:3320/api/authorization/delete_one/${id}`)
      console.log(deleteUser.data.message)
      featchAllAuthorizedUsers()
      featchAllUsers()
      console.log(`User and Authorization of this email [${email}], are successfully deleted.🗑️`)
    } catch (error) {
      console.log(`User and Authorization of this email [${email}], are not deleted!`)

    }
  }
  // ________________________________________________________________________


  return (
    <div className={styles.authorizationComp}> {/* Correct usage of SCSS class */}
      <div className={styles.header}> {/* Apply header style */}
        <div className={styles.title}> {/* Apply title style */}
          <h5 className={styles.titleText}>Authorization Management</h5> {/* Correct title styling */}
          <img src={require("../assets/alightLogo.png")} alt='logo' className={styles.logoImg} /> {/* Apply logo style */}
        </div>
        <div className={styles.navLinks}> {/* Apply navLinks style */}
          <p
            className={`${styles.link} ${activeTab === 'partners' ? styles.active : ''}`}
            onClick={() => setActiveTab('partners')}
          >
            Partners
          </p>
          <p
            className={`${styles.link} ${activeTab === 'create' ? styles.active : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create User
          </p>
        </div>
      </div>

      <div > {/* Apply authUserTable style */}
        {activeTab === 'partners' && (
          <div > {/* Apply partnerTable style */}
            {users.length === 0 ? (
              <p style={{ paddingTop: '5px', color: '#6a2929' }}>
                No users registered in the database!
              </p>
            ) : (
              <table className={styles.table}> {/* Apply table style */}
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textTransform: 'capitalize', fontWeight: '500' }}>Wahbi</td>
                    <td>
                      <a href={`mailto:wahbi@gmail.com`}>📧 wahbi@gmail.com</a>
                    </td>
                    <td>
                      <a href={`tel:23267646`}>📞 23267646</a>
                    </td>
                    <td>Connected</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div > {/* Apply createdUserTable style */}
            <div className={styles.CreatedUser}> {/* Apply createdUser style */}
              <button
                className={isClicked ? styles.addUserBtnLogo : styles.addUserBtnText} // Apply dynamic styles
                onClick={() => { setIsClicked(!isClicked); }}
              >
                {isClicked ? "➕" : "Create New"}
              </button>
              {isClicked ? (
                <input
                  type='email'
                  placeholder='Enter email of user'
                  className={styles.userInput} // Apply userInput style
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              ) : null}
            </div>

            {authUsers.length === 0 ? (
              <p style={{ paddingTop: '5px', color: '#6a2929' }}>
                No authorized users, you can create one.
              </p>
            ) : (
              <table className={styles.table}> {/* Apply table style */}
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Is Registered</th>
                    <th>Created At</th>
                    <th>Control</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Email</th>
                    <th>Is Registered</th>
                    <th>Created At</th>
                    <th>Control</th>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  
  );
};

export default Authorization;
