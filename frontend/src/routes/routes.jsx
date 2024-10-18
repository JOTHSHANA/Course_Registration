import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/dashboard";
import AppLayout from "../components/applayout/AppLayout";
import ProtectedRoute from "../components/utils/protectedRoute";
import Register from "../pages/Register/Register";
import Error from "../pages/error";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/error" element={<Error />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout
              body={
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="register" element={<Register />} />
                </Routes>
              }
            />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
