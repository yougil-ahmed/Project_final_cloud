import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './App.css'; // Assuming you have some global styles

import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardProf from './pages/DashboardProf';
import DashboardStagiaire from './pages/DashboardStagiaire';
import PrivateRoute from './components/PrivateRoute';
import Modules from './pages/Modules';
import Register from './pages/Register';
import Users from './pages/Users';
import Notes from './pages/Notes';
import Layout from './components/Layout/Layout';
import Classrooms from './pages/Classrooms';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/admin"
              element={
                <PrivateRoute roles={['admin']}>
                  <DashboardAdmin />
                </PrivateRoute>
              }
            />

            <Route
              path="/professeur"
              element={
                <PrivateRoute roles={['professeur']}>
                  <DashboardProf />
                </PrivateRoute>
              }
            />

            <Route
              path="/stagiaire"
              element={
                <PrivateRoute roles={['stagiaire']}>
                  <DashboardStagiaire />
                </PrivateRoute>
              }
            />

            <Route path="/modules" element={
              // <PrivateRoute roles={['admin', 'professeur']}>
                <Modules />
              // </PrivateRoute>
            } />

            <Route path="/users" element={
              // <PrivateRoute roles={['admin']}>
                <Users />
              // {/* </PrivateRoute> */}
            } />

            <Route path="/notes" element={
              // <PrivateRoute roles={['admin', 'professeur']}>
                <Notes />
              // {/* </PrivateRoute> */}
            } />

            <Route path="/classrooms" element={
              // <PrivateRoute roles={['admin', 'professeur']}>
                <Classrooms />
              // {/* </PrivateRoute> */}
            } />

            <Route path="*" element={<Login />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
