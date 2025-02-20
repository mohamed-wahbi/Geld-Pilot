import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "../components/authLoginRegister.css";
import A from "../A.png";
import logo from "../logo.png";
import google from "../google.jpg";
import Person from "../assets/Tablet login-amico.png";

const AuthLoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });



  const handleReCAPTCHAChange = (value) => {
    if (value) {
      setIsVerified(true);
      setErrorMessage("");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isVerified) {
      setErrorMessage("Please complete the reCAPTCHA verification.");
      return;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    setErrorMessage("");
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    })
    setIsVerified(false)
    console.log("Form submitted:", formData);
    window.location.reload()
  };

  return (
    <div className="authComp">
      <div className="backRight">
        <div className="miroir"></div>
        <img src={Person} alt="logo" width={80} className="personLogo" />
      </div>

      <div className="LoginContent">

        <div className="AlighLogo">
          <img src={logo} alt="logo" />
        </div>

        <div className="welcomeTitre">
          <h4>{isLogin ? "Welcome to Geld Pilot! 👋" : "Join Geld Pilot! 🚀"}</h4>
        </div>

        <div className="logoDescrip">
          <p>
            {isLogin
              ? "Sign in to start your financial adventure."
              : "Create an account and start your financial journey."}
          </p>
          
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="email">
              <label>Name</label>
              <input name="name" placeholder="Enter your name" type="text" value={formData.name} onChange={handleChange} required />
            </div>
          )}

          <div className="email">
            <label>Email</label>
            <input name="email" placeholder="Enter your email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          {!isLogin && (
            <div className="email">
              <label>Phone Number</label>
              <input name="phone" placeholder="Enter your phone number" type="tel" value={formData.phone} onChange={handleChange} required />
            </div>
          )}

          <div className="email">
            <label>Password</label>
            <input name="password" placeholder="Enter your password" type="password" value={formData.password} onChange={handleChange} required />
          </div>

          {!isLogin && (
            <div className="email">
              <label>Confirm Password</label>
              <input name="confirmPassword" placeholder="Confirm your password" type="password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          )}

          <div className="recaptcha">
            <ReCAPTCHA sitekey="6LepWKwqAAAAAO1P_FmjLm3MB3PwxXNpCjciDhZN" onChange={handleReCAPTCHAChange} />
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>}

          <button className="loginBtn" type="submit">{isLogin ? "Sign In" : "Sign Up"}</button>
        </form>

        <p style={{ textAlign: "center", fontSize: "15px" }}>
          {isLogin ? "New in our platform?" : "Already have an account?"}
          <span style={{ color: "#62b0d3", fontWeight: "bold", cursor: "pointer" }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Create an account" : " Sign in"}
          </span>
        </p>

        <div className="orStyle">
          <p>OR</p>
          <hr />
        </div>

        <div className="googleConnect">
          <img src={google} alt="google logo" />
        </div>
        
      </div>
    </div>
  );
};

export default AuthLoginRegister;
