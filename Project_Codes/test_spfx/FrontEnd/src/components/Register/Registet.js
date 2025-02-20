import React, { useState } from 'react';
import axios from 'axios';
import '../Register/register.css';
import ReCAPTCHA from "react-google-recaptcha";

import logo from "../../logo.png";
import google from "../../google.jpg";
import Person from "../../assets/Tablet login-amico.png";

const Register = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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

  const handleSubmit = async (e) => {
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
      const response = await axios.post("http://localhost:5000/api/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

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
          <h4>Join Geld Pilot! 🚀</h4>
        </div>

        <div className="logoDescrip">
          <p>Create an account and start your financial journey.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="email">
            <label>Name</label>
            <input name="name" placeholder="Enter your name" type="text" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="email">
            <label>Email</label>
            <input name="email" placeholder="Enter your email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="email">
            <label>Phone</label>
            <input name="phone" placeholder="Enter your phone number" type="tel" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="email">
            <label>Password</label>
            <input name="password" placeholder="Enter your password" type="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="email">
            <label>Confirm Password</label>
            <input name="confirmPassword" placeholder="Confirm your password" type="password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <div className="recaptcha">
            <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_KEY} onChange={handleReCAPTCHAChange} />
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}

          <button className="loginBtn" type="submit">Sign Up</button>
        </form>

        <p style={{ textAlign: "center", fontSize: "15px" }}>
          Already have an account? <span style={{ color: "#62b0d3", fontWeight: "bold", cursor: "pointer" }}>Sign in</span>
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

export default Register;
