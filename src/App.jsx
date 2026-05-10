import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import LoginKasir from './pages/LoginKasir'
import LoginWarehouse from './pages/LoginWarehouse'
import LoginAdmin from './pages/LoginAdmin'
import AdminDashboard from './pages/AdminDashboard'
import DashboardKasir from './pages/DashboardKasir'
import DashboardWarehouse from './pages/DashboardWarehouse'

// Guard: redirect ke login admin jika belum autentikasi
function AdminRoute({ children }) {
  const isAuth = sessionStorage.getItem('adminAuth') === 'true'
  return isAuth ? children : <Navigate to="/login/admin" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<Home />} />
        <Route path="/login/kasir"         element={<LoginKasir />} />
        <Route path="/login/warehouse"     element={<LoginWarehouse />} />
        <Route path="/login/admin"         element={<LoginAdmin />} />
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