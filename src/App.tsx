import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { isLoggedIn } from '@/lib/api'
import Navbar from '@/components/layout/Navbar'
import UploadPage from '@/pages/UploadPage'
import DashboardPage from '@/pages/DashboardPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'

// Protected Route — login nahi hai toh login page pe bhejo
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

// Public Route — login hai toh upload page pe bhejo
function PublicRoute({ children }: { children: React.ReactNode }) {
  if (isLoggedIn()) {
    return <Navigate to="/upload" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes — Navbar nahi hoga */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes — Navbar hoga */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-6xl mx-auto px-4 py-8">
                  <UploadPage />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-6xl mx-auto px-4 py-8">
                  <DashboardPage />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}