import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from '../components/Register.module.scss';
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
const AOS = require("aos");
import "aos/dist/aos.css";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string
}

const Register: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  const [isVerified, setIsVerified] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleReCAPTCHAChange = ( value:string | null ) => {
    if (value) {
      setIsVerified(true);
      setErrorMessage("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isVerified) {
      setErrorMessage("Please complete the reCAPTCHA verification.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      console.log(formData);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      const response = await axios.post("http://localhost:5000/api/register", {formData});
      console.log(response.data)
      setSuccessMessage("Registration successful! Redirecting...");
      setErrorMessage("");
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/login"; // Change "/login" according to your route
      }, 2000);

    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred during registration.");
    }
  };

  return (
    <div className={styles.authComp}>
      <div className={styles.backRight}>
        <div className={styles.miroir} onClick={()=>{window.location.href= "https://alightconsulting.sharepoint.com/sites/GeldPilot/SitePages/home.aspx"}}></div>
        <img src={require("../assets/Tablet login-amico.png")} alt="logo" width={80} className={styles.personLogo} />
      </div>

      <div className={styles.LoginContent}>
        <div >
          <img src={require("../assets/logo.png")} alt="logo" />
        </div>

        <div className={styles.welcomeTitre}>
          <h4>Join Geld Pilot! 🚀</h4>
        </div>

        <div className={styles.logoDescrip}>
          <p>Create an account and start your financial journey.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.email}>
            <label>Name</label>
            <input name="name" placeholder="Enter your name" type="text" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.email}>
            <label>Email</label>
            <input name="email" placeholder="Enter your email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className={styles.email}>
            <label>Phone</label>
            <input name="phone" placeholder="Enter your phone number" type="tel" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className={styles.email}>
            <label>Password</label>
            <input name="password" placeholder="Enter your password" type="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className={styles.email}>
            <label>Confirm Password</label>
            <input name="confirmPassword" placeholder="Confirm your password" type="password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <div>
            <ReCAPTCHA sitekey="6LeGL90qAAAAAGGG1leCj3bWsUevD0256Nil5WFG" onChange={handleReCAPTCHAChange} />
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}

          <button className={styles.loginBtn} type="submit">Sign Up</button>
        </form>

        <p style={{ textAlign: "center", fontSize: "15px" }}>
          Already have an account? <span style={{ color: "#62b0d3", fontWeight: "bold", cursor: "pointer" }}
          onClick={() => window.location.href = "https://alightconsulting.sharepoint.com/sites/GeldPilot/SitePages/Login.aspx"}
          >Sign in</span>
        </p>

        <div className={styles.orStyle}>
          <p>OR</p>
          <hr />
        </div>

        <div className={styles.googleConnect}>
          <img src={require("../assets/google.jpg")} alt="google logo" />
        </div>
      </div>
    </div>
  );
};

export default Register;
