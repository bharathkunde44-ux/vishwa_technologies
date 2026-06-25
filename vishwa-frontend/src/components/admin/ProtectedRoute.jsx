import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // Sync token to sessionStorage if it only exists in localStorage (due to Remember Me)
  if (token && !sessionStorage.getItem('admin_token')) {
    sessionStorage.setItem('admin_token', token);
    sessionStorage.setItem('admin_authenticated', 'true');
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      sessionStorage.setItem('admin_user', savedUser);
    }
  }

  return children;
}
