import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function MoleculeModal({ setMoleculeModal, moleculeModal }) {
  const navigate = useNavigate();

  const confirm = ()=>{
  }

  return (
    <div className="modal-container">
      <div className="modal-box molecule-modal-box">
        <h1>Details Du Medicaments</h1>
        <div className='field'>
            <label className='main-label'>Solvant: </label>
            <select className='main-input'>
            </select>
        </div>
        <div className='field'>
            <label className='main-label'>Volume</label>
            <select className='main-input'>
            </select>
        </div>
        <div className='field'>
            <label className='main-label'>CC min</label>
            <input className='main-input' type='number' />
            <label className='main-label'>CC max</label>
            <input className='main-input' type='number' />
        </div>
        <div className="btn-container">
          <button className="main-btn" onClick={()=>setMoleculeModal({})}>Annuler</button>
          <button className="main-btn" onClick={confirm}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}
