import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Login } from './components/Login/Login'
import { Dashboard } from './components/Dashboard/Dashboard'

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard path={'patients'} />} />
          <Route path="/prescription" element={<Dashboard path={'prescription'} />} />
          <Route path="/planning/:patientId" element={<Dashboard path={'planning'} />} />
          <Route path="/add-patient" element={<Dashboard />} />
          <Route path="/*" element={<Navigate to='/dashboard' />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
