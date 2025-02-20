import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from '../components/Login.module.scss';
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
const AOS = require("aos");
import "aos/dist/aos.css";

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleReCAPTCHAChange = (value: string | null) => {
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
    setErrorMessage("");

    try {
      console.log(formData);
      setFormData({ email: "", password: "" });
      const response = await axios.post("https://your-api.com/api/login", formData);
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
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
          <h4>Welcome to Geld Pilot! 👋</h4>
        </div>
        <div className={styles.logoDescrip}>
          <p>Sign in to start your financial adventure.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.email}>
            <label>Email</label>
            <input
              name="email"
              placeholder="Enter your email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.email}>
            <label>Password</label>
            <input
              name="password"
              placeholder="Enter your password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div >
            <ReCAPTCHA
              sitekey="6LeGL90qAAAAAGGG1leCj3bWsUevD0256Nil5WFG"
              onChange={handleReCAPTCHAChange}
            />
          </div>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <button className={styles.loginBtn} type="submit">Sign In</button>
        </form>
        <p style={{ textAlign: "center", fontSize: "15px" }}>
          New in our platform? <span style={{ color: "#62b0d3", fontWeight: "bold", cursor: "pointer" }}
          onClick={()=>{window.location.href= "https://alightconsulting.sharepoint.com/sites/GeldPilot/SitePages/Register.aspx"}}   
          >Create an account</span>
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

export default Login;
