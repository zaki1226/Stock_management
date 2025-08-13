import React, { Component } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'; // Added Navigate
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UserList from './components/UserList.jsx';
import UserCreate from './pages/UserCreate.jsx';
import UserEdit from './pages/UserEdit.jsx';
import RoleManagementPage from './pages/RoleManagementPage.jsx';
import SystemRoleManagement from './components/SystemRoleManagement.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import ForgotPassword from './passwordmanagement/ForgotPassword.jsx';
import ResetPassword from './passwordmanagement/ResetPassword.jsx';
import RoleList from './components/RoleList.jsx';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5 text-center">
          <h2 className="text-danger">Something went wrong</h2>
          <p className="text-muted">Error: {this.state.error.message}</p>
          <button className="btn btn-primary mt-3" onClick={() => this.setState({ hasError: false, error: null })}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const showNavbar = token && !['/', '/forgot-password', '/reset-password'].includes(location.pathname);
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  const baseMargin = showNavbar && !isCollapsed ? '120px' : '60px';
  const contentMargin = location.pathname === '/users' ? (showNavbar && !isCollapsed ? '80px' : '60px') : baseMargin; // Reduced for /users

  // Redirect to /dashboard if logged in and on root path
  if (token && location.pathname === '/') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {showNavbar && <Navbar />}
      <div className="flex-grow-1" style={{ marginLeft: contentMargin, padding: '20px', transition: 'margin-left 0.3s' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserList contentMargin={contentMargin} />} />
          <Route path="/users/create" element={<UserCreate />} />
          <Route path="/users/edit/:id" element={<UserEdit />} />
          <Route path="/users/:id" element={<UserProfilePage />} />
          <Route path="/roles" element={<RoleList />} />
          <Route path="/system-roles" element={<SystemRoleManagement />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;