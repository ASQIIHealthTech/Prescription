import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddProductJours from './AddProductJours';


export default function AddProductModal({ setAddProd, data, selectedCure, refreshData }) {
  const navigate = useNavigate();
  let [molecules, setMolecules] = useState([]);
  let [jours, setJours] = useState([]);
  
  let molRef = useRef(0); 
  let cureRef = useRef(0); 
  let JRef = useRef(0); 

  useEffect(()=>{
    axios.post(process.env.REACT_APP_SERVER_URL + '/getAllMolecules', {})
      .then((res) => {
        console.log(data);
        setMolecules(res.data)
      })
      .catch((err)=>{
        console.log(err)
      })
  }, [])

  const save = ()=>{
    const molecule = molRef.current.value;
    const cure = cureRef.current.value;

    console.log(jours)
    axios.post(process.env.REACT_APP_SERVER_URL + '/addProduct', { molecule, cure, jours })
      .then(res=>{
        console.log(res)
        refreshData();
        setAddProd(0);
      })
      

  }

  return (
    <div className="modal-container">
      <div className="modal-box addProd-modal-box">
        <h1>Ajouter Produit</h1>
        <div className='field'>
            <label className='main-label'>Molecule: </label>
            <select ref={molRef} name="mol" id="mol" className="main-input">
              <option value=""></option>
              {molecules.map(mol=>(
                <option value={mol.molecule}>{mol.molecule}</option>
              ))}
            </select>
        </div>
        <div className='field'>
            <label className='main-label'>Cure: </label>
            <select ref={cureRef} name="cure" id="cure" className="main-input">
              <option value={data.Cures[selectedCure].id}>{data.Cures[selectedCure].name}</option>
            </select>
        </div>
        <div className='field'>
          <AddProductJours jours={jours} setJours={setJours} data={data} selectedCure={selectedCure} />
        </div>
        <div className="btn-container">
          <button className="main-btn" onClick={()=>setAddProd(0)}>Annuler</button>
          <button className="main-btn" onClick={()=>save()} >Confirmer</button>
        </div>
      </div>
    </div>
  );
}
