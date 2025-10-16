// src/pages/AdminPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "../component/admin/AdminDashboard";

const AdminPage = () => {
  const navigate = useNavigate();

  // If no token or role is missing, redirect
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/login");
    }
  }, []);

  return <AdminDashboard />;
};

export default AdminPage;
