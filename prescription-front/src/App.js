import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Login } from './components/Login/Login'
import { Dashboard } from './components/Dashboard/Dashboard'
import Test from './components/Login/Test'
import FAB from './components/Dashboard/Pharmacien/FAB';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

function App() {
  let [user, setUser] = useState({})

  useEffect(()=>{
      let token = Cookies.get('token');
      axios.post(process.env.REACT_APP_SERVER_URL + '/checkToken', { token })
          .then((res)=>{
              setUser(res.data.tokenUser)
          })
  }, [])

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/test" element={<Test />} />
          {/* MEDECIN */}
          <Route path="/dashboard" element={<Dashboard path={'patients'} />} />
          <Route path="/prescription/:presId" element={<Dashboard path={'prescription'} />} />
          <Route path="/fiche/:presId" element={<Dashboard path={'fiche'} />} />
          <Route path="/planning/:patientId" element={<Dashboard path={'planning'} />} />
          <Route path="/add-patient" element={<Dashboard />} />
          {/* Pharmacien */}
          <Route path="/*" element={<Navigate to='/dashboard' />} />
          <Route path="/FAB" user={user} element={<FAB />} />
          {/* Admin */}
          <Route path="/addProtocole" element={<Dashboard path={'addProtocole'} />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
