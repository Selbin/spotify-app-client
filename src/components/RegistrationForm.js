// RegistrationForm.js
import React, { useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import showErrorPopup from "../utils/triggerToast"

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}user/register`,
        { name, email, password, confirmPassword }
      );
      setIsLoading(false);
      window.localStorage.setItem('tokens', JSON.stringify(response.data))
      navigate('/home')
    } catch (error) {
      if (error.response.data.errors) {
        const errors = error.response.data.errors
        errors.forEach(err => {
          showErrorPopup(err.msg)
        });
      } else {
        showErrorPopup(error.response.data.message)
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <form className="login-form" onSubmit={handleRegistration}>
        <input
          className="inputBox"
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="inputBox"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="inputBox"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="inputBox"
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="button" disabled={isLoading} type="submit">
          {isLoading ? "Loading..." : "Register"}
        </button>
      </form>
    </>
  );
};

export default RegistrationForm;
