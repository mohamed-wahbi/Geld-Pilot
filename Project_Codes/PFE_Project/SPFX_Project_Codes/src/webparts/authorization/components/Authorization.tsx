import * as React from 'react';
import styles from './Authorization.module.scss';
// const AOS = require("aos");
import "aos/dist/aos.css";
// import { useEffect, useState } from 'react';

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

  return (
    <div className={styles.content}>
      wahbi
    </div>
  );
};

export default Authorization;
