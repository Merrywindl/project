import React from 'react';
import Navbar from './navbar';
import './App.css';
import PaycheckForm from './PaycheckForm';
import Footer from './Footer';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { HourlyWageCalculator } from './pages/hourlyrate';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: '1' }}>
          <Routes>
            <Route path="/" element={<PaycheckForm />} />
            <Route path="/hourly-wage-calculator" element={<HourlyWageCalculator />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
