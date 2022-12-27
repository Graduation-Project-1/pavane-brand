import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Dashboard from '../../layouts/Dashboard/Dashboard';
import './ProtectedRoute.scss'

export default function ProtectedRoute() {

  const auth = useSelector((state) => state.auth);

  if (auth.AdminToken) {
    return <Dashboard />
  } else {
    return <Navigate to="/login" />;
  }
}
