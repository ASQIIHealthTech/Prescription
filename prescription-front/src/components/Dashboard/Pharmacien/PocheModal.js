import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function PocheModal({ poche, setPoche, setVehData, vehData, getAdjustedDose, getAdaptedDose, prepMolecule }) {
  const navigate = useNavigate();
  let type = useRef(0);
  let contenu = useRef(0);
  let volume = useRef(0);
  let volume_finale = useRef(0);
  let [conc, setConc] = useState(( getAdjustedDose(getAdaptedDose()) / parseInt((vehData ? vehData.volume : ( (prepMolecule?.volume_dilution) ? prepMolecule.volume_dilution : 500 )  )) ).toFixed(2));

  const findClosestBiggerVolume = () => {
    let targetValue = volume_finale.current.value;
    const filteredVolumes = [500, 250, 100].filter(num => num >= targetValue);

    let closestBiggerNumber;
    if (filteredVolumes.length > 0) {
     closestBiggerNumber = Math.min(...filteredVolumes);
    }
    if(closestBiggerNumber){
      volume.current.value = closestBiggerNumber;
    }
  };

  const save = ()=>{
    let data = {
      id_product: poche,
      type: type.current.value,
      contenu: contenu.current.value,
      volume: volume.current.value,
      volume_finale: volume_finale.current.value
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

  const calcConcentration = (isVolumeFinale)=>{
    let vol = (volume_finale.current.value ? volume_finale.current.value : volume.current.value)
    setConc(( getAdjustedDose(getAdaptedDose()) / parseInt(vol) ).toFixed(2))
    if(isVolumeFinale){
      findClosestBiggerVolume()
    }
  }

  return (
    <div className="modal-container">
      <div className="modal-box poche-modal-box">
        <h1>Véhicule</h1>
        <div className='field'>
            <label className='main-label'>Conditionnement finale: </label>
            <select defaultValue={vehData?.type} ref={type} name="poche" id="poche" className="main-input">
              <option value="Poche">Poche</option>
              <option value="Verre">Verre</option>
            </select>
        </div>
        <div className='field'>
            <label className='main-label'>Véhicule: </label>
            <select defaultValue={vehData?.contenu || (prepMolecule.vehicule == 'G5%' ? 'Gluscose' : 'Na Cl')} ref={contenu} name="poche" id="poche" className="main-input">
              <option value="Na Cl">Na Cl</option>
              <option value="Gluscose">Gluscose</option>
            </select>
        </div>
        <div className='field'>
            <label className='main-label'>Volume véhicule: </label>
            <select defaultValue={vehData?.volume} onChange={()=>calcConcentration(false)} ref={volume} name="poche" id="poche" className="main-input">
              <option value="500">500</option>
              <option value="250">250</option>
              <option value="100">100</option>
            </select>
        </div>
        <div className='field'>
          <label className='main-label'>Volume Finale: </label>
          <input className="main-input" onChange={()=>calcConcentration(true)} defaultValue={vehData?.volume_finale || prepMolecule.volume_dilution} ref={volume_finale} />
        </div>
        <div className="field">
          <label>Concentration: </label>
          {
            (conc > prepMolecule.concentration_min && conc < prepMolecule.concentration_max) ? (
              <label className='main-label'>{conc } mg/ml </label>
              ) : (
              <label className='main-label red-text'>{conc } mg/ml </label>
            )
          }
        </div>
        <div className="btn-container">
          <button className="main-btn" onClick={()=>setPoche(0)}>Annuler</button>
          <button className="main-btn" onClick={()=>save()} >Confirmer</button>
        </div>
      </div>
    </div>
  );
}
