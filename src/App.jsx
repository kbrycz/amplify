import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Backdrop from './components/Backdrop';
import Dashboard from './pages/Dashboard';
import CreateCampaign from './pages/CreateCampaign';
import ManageCampaigns from './pages/ManageCampaigns';
import EditAccount from './pages/EditAccount';
import Support from './pages/Support';

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function RequireUnauth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header />
          <Backdrop />
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return <Landing />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<AppContent />} />
          <Route
            path="/login"
            element={
              <RequireUnauth>
                <SignIn />
              </RequireUnauth>
            }
          />
          <Route
            path="/signup"
            element={
              <RequireUnauth>
                <SignUp />
              </RequireUnauth>
            }
          />
          
          {/* Protected routes */}
          <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="campaigns/new" element={<CreateCampaign />} />
            <Route path="campaigns" element={<ManageCampaigns />} />
            <Route path="account" element={<EditAccount />} />
            <Route path="support" element={<Support />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;