import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function PocheModal({ poche, setPoche, setVehData, vehData, getAdjustedDose, getAdaptedDose }) {
  const navigate = useNavigate();
  let type = useRef(0);
  let contenu = useRef(0);
  let volume = useRef(0);
  let [conc, setConc] = useState(( getAdjustedDose(getAdaptedDose()) / parseInt((vehData ? vehData.volume : 500)) ).toFixed(2));

  const save = ()=>{
    let data = {
      id_product: poche,
      type: type.current.value,
      contenu: contenu.current.value,
      volume: volume.current.value
    }
    axios.post(process.env.REACT_APP_SERVER_URL + "/saveVehicule", { data })
      .then((res) => {
        setVehData(data);
        console.log(res)
      })
      .catch((err) => {
        console.log(err);
      })
      setPoche(0)
  }

  const calcConcentration = ()=>{
    setConc(( getAdjustedDose(getAdaptedDose()) / parseInt(volume.current.value) ).toFixed(2))
  }

  return (
    <div className="modal-container">
      <div className="modal-box poche-modal-box">
        <h1>Véhicule</h1>
        <div className='field'>
            <label className='main-label'>Type: </label>
            <select defaultValue={vehData?.type} ref={type} name="poche" id="poche" className="main-input">
              <option value="Poche">Poche</option>
              <option value="Verre">Verre</option>
            </select>
        </div>
        <div className='field'>
            <label className='main-label'>Type: </label>
            <select defaultValue={vehData?.contenu} ref={contenu} name="poche" id="poche" className="main-input">
              <option value="Na Cl">Na Cl</option>
              <option value="Gluscose">Gluscose</option>
            </select>
        </div>
        <div className='field'>
            <label className='main-label'>Volume: </label>
            <select defaultValue={vehData?.volume} onChange={calcConcentration} ref={volume} name="poche" id="poche" className="main-input">
              <option value="500">500</option>
              <option value="250">250</option>
              <option value="100">100</option>
            </select>
        </div>
        <div className="field">
          <label>Concentration: </label>
          <label className='main-label'>{conc } </label>
        </div>
        <div className="btn-container">
          <button className="main-btn" onClick={()=>setPoche(0)}>Annuler</button>
          <button className="main-btn" onClick={()=>save()} >Confirmer</button>
        </div>
      </div>
    </div>
  );
}
