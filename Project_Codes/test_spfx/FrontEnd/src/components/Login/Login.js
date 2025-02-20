import React, { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import "../Login/login.css";
import logo from "../../logo.png";
import google from "../../google.jpg";
import Person from "../../assets/Tablet login-amico.png";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      setErrorMessage("Please complete the reCAPTCHA verification.");
      return;
    }
    setErrorMessage("");

    try {
      console.log(formData)
      setFormData({ email: "", password: ""})
      const response = await axios.post("https://your-api.com/api/login", formData);
      console.log("Login successful:", response.data);
      // Stocker le token d'authentification si nécessaire
      localStorage.setItem("token", response.data.token);
      

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
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
          <h4>Welcome to Geld Pilot! 👋</h4>
        </div>

        <div className="logoDescrip">
          <p>Sign in to start your financial adventure.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="email">
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

          <div className="email">
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

          <div className="recaptcha">
            <ReCAPTCHA
              sitekey="6LeGL90qAAAAAGGG1leCj3bWsUevD0256Nil5WFG"
              onChange={handleReCAPTCHAChange}
            />
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>}

          <button className="loginBtn" type="submit">Sign In</button>
        </form>

        <p style={{ textAlign: "center", fontSize: "15px" }}>
          New in our platform?
          <span
            style={{ color: "#62b0d3", fontWeight: "bold", cursor: "pointer" }}
            
          > Create an account
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

export default Login;