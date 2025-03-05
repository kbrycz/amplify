import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet, useNavigationType, useNavigate } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/toast-notification';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import { CookieConsent } from './components/ui/cookie-consent';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Backdrop from './components/Backdrop';
import Dashboard from './pages/Dashboard';
import CreateCampaign from './pages/CreateCampaign';
import ManageCampaigns from './pages/ManageCampaigns';
import CampaignDetails from './pages/CampaignDetails';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import EditProfile from './pages/EditProfile';
import Account from './pages/Account';
import Support from './pages/Support';
import Survey from './pages/Survey.jsx';
import Responses from './pages/Responses';
import AIVideos from './pages/AIVideos';
import VideoEnhancer from './pages/VideoEnhancer';
import CampaignSettings from './pages/CampaignSettings';
import PricingPage from './pages/PricingPage';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';

function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();

  React.useEffect(() => {
    if (navigationType === 'PUSH') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location, navigationType]);

  return null;
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function RequireUnauth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (user) {
    return <Navigate to="/pricing" replace />; // Redirect to pricing instead of root
  }

  return children;
}

function AppLayout() {
  const location = useLocation();
  if (location.pathname === '/pricing') {
    return <Outlet />;
  }
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
  const location = useLocation();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent dark:border-indigo-400 dark:border-r-transparent" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading your experience...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to /pricing instead of /app/dashboard
  if (user && location.pathname === '/') {
    return <Navigate to="/pricing" replace />;
  }

  return <Landing />;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <CookieConsent />
          <Routes>
            <Route path="/survey/:id" element={<Survey />} />
            <Route path="/" element={<AppContent />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<RequireUnauth><SignIn /></RequireUnauth>} />
            <Route path="/signup" element={<RequireUnauth><SignUp /></RequireUnauth>} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/success" element={<RequireAuth><CheckoutSuccess /></RequireAuth>} />
            <Route path="/cancel" element={<RequireAuth><CheckoutCancel /></RequireAuth>} />
            <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="campaigns/new" element={<CreateCampaign />} />
              <Route path="campaigns/:id/ai-videos" element={<AIVideos />} />
              <Route path="campaigns/:id/responses" element={<Responses />} />
              <Route path="campaigns/:id/settings" element={<CampaignSettings />} />
              <Route path="campaigns/:id" element={<CampaignDetails />} />
              <Route path="campaigns" element={<ManageCampaigns />} />
              <Route path="video-enhancer" element={<VideoEnhancer />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="profile" element={<EditProfile />} />
              <Route path="account" element={<Account />} />
              <Route path="settings" element={<Settings />} />
              <Route path="support" element={<Support />} />
              <Route path="pricing" element={<PricingPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;