import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { SignUpForm } from './components/SignUpForm';
import ChatbotOnboarding from './components/ChatbotOnboarding';
import { ModeSelection } from './pages/ModeSelection';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Contact } from './pages/Contact';
import { Resources } from './pages/Resources';
import { Dashboard } from './pages/Dashboard';
import { ChatBot } from './pages/ChatBot';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#1a1a1a]">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="vertical-lines" x="0" y="0" width="20" height="100%" patternUnits="userSpaceOnUse">
                    <line x1="10" y1="0" x2="10" y2="100%" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#vertical-lines)" />
              </svg>
            </div>
          </div>
        </div>
        <Navbar />
        <div className="relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/onboarding" element={<ChatbotOnboarding />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/modes" element={<ModeSelection />} />
            <Route path="/chat/:mode" element={<ChatBot />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;