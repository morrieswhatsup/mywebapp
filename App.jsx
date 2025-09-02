import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import LoginScreen from '@/components/LoginScreen';
import MainScreen from '@/components/MainScreen';
import NewEntryScreen from '@/components/NewEntryScreen';
import JobDetailsScreen from '@/components/JobDetailsScreen';
import HistoryScreen from '@/components/HistoryScreen';

function App() {
  return (
    <>
      <Helmet>
        <title>Field Services Management - ZA</title>
        <meta name="description" content="Professional field services management app for South African businesses. Track jobs, manage clients, and streamline field operations." />
        <meta property="og:title" content="Field Services Management - ZA" />
        <meta property="og:description" content="Professional field services management app for South African businesses. Track jobs, manage clients, and streamline field operations." />
      </Helmet>
      
      <div className="mobile-container">
        <Router>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/main" element={<MainScreen />} />
            <Route path="/new-entry" element={<NewEntryScreen />} />
            <Route path="/job-details/:entryId" element={<JobDetailsScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
          </Routes>
        </Router>
        <Toaster />
      </div>
    </>
  );
}

export default App;