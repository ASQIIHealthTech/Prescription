import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/base';
import { Alert } from '@mui/material';


export default function ConfirmChangesModal({ setConfirmChanges, cure, refreshData }) {
  const navigate = useNavigate();
  let passRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [alertText, setAlertText] = useState(''); 

  const confirm = ()=>{
    let pass = passRef.current.value;

    axios.post(process.env.REACT_APP_SERVER_URL + '/updateCure', { pass, cure })
        .then((res) => {
            console.log(res)
            refreshData()
            setConfirmChanges(false)
        })
        .catch((err) => {
            setAlertText(err.response.data);
            setOpen(true);
        })
  }

    const handleAlertClose = ()=>{
        setOpen(false);
    }

  return (
    <div className="modal-container">
        {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleAlertClose} >
            <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>
                {alertText}
            </Alert>
        </Snackbar> */}
      <div className="modal-box confirmation-modal-box">
        <h1>Entrez votre mot de passe</h1>
        <label className='main-label'>Pour confirmer l'enregistrement , veuillez entrer votre mot de passe : </label>
        <div className='field'>
            <label className='main-label'>Mot De Passe</label>
            <input className='main-input' type='password' ref={passRef} />
        </div>
        <div className="btn-container">
          <button className="main-btn" onClick={()=>setConfirmChanges(false)}>Annuler</button>
          <button className="main-btn" onClick={confirm}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}
