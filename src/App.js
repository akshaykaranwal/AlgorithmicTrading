import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/topBar';
import Login from './pages/login.jsx';
import Register from './pages/Register.jsx';
import CandlestickChart from './pages/Home';
import Alpha from './components/AlphaVantage.jsx';

function App() {
  return (
    <Router>
      <TopBar />
      <div style={{ paddingTop: '70px' }}> {/* Add padding-top to the main content */}
        <Routes>
          <Route path='/reg' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<CandlestickChart />} />
          <Route path='/alpha' element={<Alpha />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
