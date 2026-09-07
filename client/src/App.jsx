import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';
import StationPage from './pages/StationPage';
import OfficerDashboard from './pages/OfficerDashboard';
import OperatorDashboard from './pages/OperatorDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Landing />
          </ProtectedRoute>
        }
      />

      <Route
        path="/station/:id"
        element={
          <ProtectedRoute>
            <StationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/officer"
        element={
          <ProtectedRoute roles={['officer', 'admin']}>
            <OfficerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/operator/:stationId"
        element={
          <ProtectedRoute roles={['operator', 'admin']}>
            <OperatorDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
