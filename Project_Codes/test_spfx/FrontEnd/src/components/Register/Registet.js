import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "../register.css";
import logo from "../logo.png";

const Register = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    setErrorMessage("");
    console.log("Registration successful:", formData);
    setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="auth-container">
      <div className="register-content">
        <img src={logo} alt="logo" className="logo" />
        <h4>Join Geld Pilot! 🚀</h4>
        <p>Create an account and start your financial journey.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_KEY} onChange={handleReCAPTCHAChange} />

          {errorMessage && <p className="error">{errorMessage}</p>}

          <button type="submit" className="register-btn">Sign Up</button>
        </form>

        <p>Already have an account? <span onClick={switchToLogin}>Sign in</span></p>
      </div>
    </div>
  );
};

export default Register;
