import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Backdrop from './components/Backdrop';
import Dashboard from './pages/Dashboard';
import CreateCampaign from './pages/CreateCampaign';
import ManageCampaigns from './pages/ManageCampaigns';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/app/*"
          element={
            <SidebarProvider>
              <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                <Sidebar />
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                  <Header />
                  <Backdrop />
                  <div className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/campaigns/new" element={<CreateCampaign />} />
                      <Route path="/campaigns" element={<ManageCampaigns />} />
                      <Route path="*" element={<Navigate to="/app" replace />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </SidebarProvider>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;