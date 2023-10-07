// LoginForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import showErrorPopup from "../utils/triggerToast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('tokens')){
      navigate('/home')
    }
  },[navigate])
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}user/login`,
        { email, password }
      );
      setIsLoading(false);
      window.localStorage.setItem("tokens", JSON.stringify(response.data));
      navigate('/home')
    } catch (error) {
      if (error.response.data.errors) {
        const errors = error.response.data.errors;
        errors.forEach((err) => {
          showErrorPopup(err.msg);
        });
      } else {
        showErrorPopup(error.response.data.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="inputBox"
          type="text"
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
        <button className="button" disabled={isLoading} type="submit">
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
