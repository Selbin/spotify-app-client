import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
import PrivateRoute from "./PrivateRouter";
import Home from "../components/Home";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/Register" element={<RegistrationForm />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;