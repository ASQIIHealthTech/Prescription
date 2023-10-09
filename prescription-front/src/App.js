import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Login } from './components/Login/Login'
import { Dashboard } from './components/Dashboard/Dashboard'
import FAB from './components/Dashboard/Pharmacien/FAB';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* MEDECIN */}
          <Route path="/dashboard" element={<Dashboard path={'patients'} />} />
          <Route path="/prescription/:presId" element={<Dashboard path={'prescription'} />} />
          <Route path="/planning/:patientId" element={<Dashboard path={'planning'} />} />
          <Route path="/add-patient" element={<Dashboard />} />
          {/* Pharmacien */}
          <Route path="/*" element={<Navigate to='/dashboard' />} />
          <Route path="/FAB" element={<FAB />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
