import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const [isLogin, setIsLogin] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(
          localStorage.getItem("tokens")
        );
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}user/check-jwt`,
          {
            accessToken: token.accessToken,
          }
        );
        if (res.data.isValid) {
          setIsLogin(true);
        } else {
          // update access token using refreshtoken
          const res = await axios.post(
            `${process.env.REACT_APP_API_URL}user/refresh`,
            {
              email: token.email,
              refreshToken: token.refreshToken,
            }
          );
          token.accessToken = res.data.accessToken
          localStorage.setItem('tokens', JSON.stringify(token))
        }
      } catch (err) {
        setIsLogin(false);
        window.localStorage.clear()
      }
    };
    fetchData();
  }, []);
  return (
    <React.Fragment>
      {isLogin ? children : <Navigate to="/login" replace />}
    </React.Fragment>
  );
}

export default PrivateRoute;
