import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { SuperAdminRoute } from './components/SuperAdminRoute'
import { AppLayout } from './components/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { ListingDetailPage } from './pages/ListingDetailPage'
import { NewListingPage } from './pages/NewListingPage'
import { ChatsPage } from './pages/ChatsPage'
import { ChatDetailPage } from './pages/ChatDetailPage'
import { ProfilePage } from './pages/ProfilePage'
import { AdminReportsPage } from './pages/AdminReportsPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/chats" element={<ChatsPage />} />
                <Route path="/chats/:id" element={<ChatDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/listings/new" element={<NewListingPage />} />
                <Route path="/listings/:id" element={<ListingDetailPage />} />
                <Route element={<SuperAdminRoute />}>
                  <Route path="/admin/reports" element={<AdminReportsPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
