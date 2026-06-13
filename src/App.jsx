import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import DashboardKasir from './pages/DashboardKasir'
import DashboardWarehouse from './pages/DashboardWarehouse'

function AdminRoute({ children }) {
  const isAuth = sessionStorage.getItem('adminAuth') === 'true'
  return isAuth ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<Login />} />
        <Route path="/dashboard/kasir"     element={<DashboardKasir />} />
        <Route path="/dashboard/warehouse" element={<DashboardWarehouse />} />
        <Route path="/admin"               element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}