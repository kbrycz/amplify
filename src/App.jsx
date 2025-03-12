import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet, useNavigationType, useNavigate } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ServerStatusProvider, useServerStatus } from './context/ServerStatusContext';
import { NamespaceProvider } from './context/NamespaceContext';
import { ToastProvider } from './components/ui/toast-notification';
import ServerDownBanner from './components/ui/ServerDownBanner';
import NamespaceModal from './components/namespace/NamespaceModal';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import { CookieConsent } from './components/ui/cookie-consent';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Header from './components/header/Header';
import Sidebar from './components/header/Sidebar';
import Backdrop from './components//header/Backdrop';
import Dashboard from './pages/Dashboard';
import CreateCampaign from './pages/CreateCampaign';
import ManageCampaigns from './pages/ManageCampaigns';
import CreateTemplate from './pages/CreateTemplate';
import ManageTemplates from './pages/ManageTemplates';
import CampaignDetails from './pages/CampaignDetails';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import EditProfile from './pages/EditProfile';
import Account from './pages/Account';
import Support from './pages/Support';
import Survey from './pages/Survey.jsx';
import Responses from './pages/Responses';
import VideoPolisher from './pages/VideoPolisher';
import CampaignSettings from './pages/CampaignSettings';
import PricingPage from './pages/PricingPage';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import TemplateDetails from './pages/TemplateDetails';
import CreateNamespace from './pages/CreateNamespace';
import ManageNamespaces from './pages/ManageNamespaces';
import EditNamespace from './pages/EditNamespace';

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
    // If the user is coming from signup, redirect to pricing
    if (location.pathname === '/signup') {
      return <Navigate to="/pricing" replace />;
    }
    // Otherwise, redirect to dashboard
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
}

// Banner component that uses the ServerStatusContext
function ServerStatusBanner() {
  // Get server status context safely
  const serverStatus = useServerStatus();
  
  // If context is not available, don't render anything
  if (!serverStatus) {
    console.warn('ServerStatusContext not available');
    return null;
  }
  
  const { isServerDown, bannerDismissed, dismissBanner } = serverStatus;
  
  // Debug log to help troubleshoot visibility issues
  React.useEffect(() => {
    console.log('ServerStatusBanner state:', { isServerDown, bannerDismissed });
  }, [isServerDown, bannerDismissed]);
  
  // Don't memoize to ensure it always renders when state changes
  return (
    <ServerDownBanner 
      isVisible={isServerDown && !bannerDismissed} 
      onClose={dismissBanner} 
    />
  );
}

function AppLayout() {
  const location = useLocation();
  if (location.pathname === '/pricing') {
    return (
      <>
        <ServerStatusBanner />
        <Outlet />
      </>
    );
  }
  return (
    <SidebarProvider>
      <NamespaceProvider>
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
          <ServerStatusBanner />
          <div className="flex flex-1 h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              <Header />
              <Backdrop />
              <div className="flex-1 overflow-y-auto">
                <Outlet />
              </div>
            </div>
          </div>
          <NamespaceModal />
        </div>
      </NamespaceProvider>
    </SidebarProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check if the user just signed up
  const isFromSignup = location.state?.from?.pathname === '/signup';

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

  // Redirect authenticated users based on their origin
  if (user && location.pathname === '/') {
    // If user is coming from signup, redirect to pricing
    if (isFromSignup) {
      return <Navigate to="/pricing" replace />;
    }
    // Otherwise, redirect to dashboard
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <>
      <ServerStatusBanner />
      <Landing />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ServerStatusProvider>
          <BrowserRouter>
            <ScrollToTop />
            <CookieConsent />
            <Routes>
              <Route path="/survey/:id" element={
                <>
                  <ServerStatusBanner />
                  <Survey />
                </>
              } />
              <Route path="/" element={<AppContent />} />
              <Route path="/about" element={
                <>
                  <ServerStatusBanner />
                  <About />
                </>
              } />
              <Route path="/login" element={<RequireUnauth>
                <>
                  <ServerStatusBanner />
                  <SignIn />
                </>
              </RequireUnauth>} />
              <Route path="/signup" element={<RequireUnauth>
                <>
                  <ServerStatusBanner />
                  <SignUp />
                </>
              </RequireUnauth>} />
              <Route path="/pricing" element={
                <>
                  <ServerStatusBanner />
                  <PricingPage />
                </>
              } />
              <Route path="/success" element={<RequireAuth>
                <>
                  <ServerStatusBanner />
                  <CheckoutSuccess />
                </>
              </RequireAuth>} />
              <Route path="/cancel" element={<RequireAuth>
                <>
                  <ServerStatusBanner />
                  <CheckoutCancel />
                </>
              </RequireAuth>} />
              <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="campaigns/new" element={<CreateCampaign />} />
                <Route path="campaigns/:id/responses" element={<Responses />} />
                <Route path="campaigns/:campaignId/responses/:id/polish" element={<VideoPolisher />} />
                <Route path="campaigns/:id/settings" element={<CampaignSettings />} />
                <Route path="campaigns/:id" element={<CampaignDetails />} />
                <Route path="campaigns" element={<ManageCampaigns />} />
                <Route path="templates/new" element={<CreateTemplate />} />
                <Route path="templates/:id" element={<TemplateDetails />} />
                <Route path="templates" element={<ManageTemplates />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="profile" element={<EditProfile />} />
                <Route path="account" element={<Account />} />
                <Route path="settings" element={<Settings />} />
                <Route path="support" element={<Support />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="namespaces/create" element={<CreateNamespace />} />
                <Route path="namespaces/manage" element={<ManageNamespaces />} />
                <Route path="namespaces/edit/:id" element={<EditNamespace />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ServerStatusProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;