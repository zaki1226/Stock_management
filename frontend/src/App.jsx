import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import UserCreate from './pages/UserCreate.jsx';
import UserEdit from './pages/UserEdit.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import RoleManagementPage from './pages/RoleManagementPage.jsx';
import UserList from './components/UserList.jsx';

function App() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const showNavbar = token && location.pathname !== '/';

  return (
    <div className="app-container">
      {showNavbar && <Navbar />}
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users/create" element={<UserCreate />} />
          <Route path="/users/edit/:id" element={<UserEdit />} />
          <Route path="/users/:id" element={<UserProfilePage />} />
          <Route path="/roles" element={<RoleManagementPage />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;