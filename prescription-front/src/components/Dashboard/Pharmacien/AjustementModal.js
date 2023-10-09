import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RepartitionTable from './RepartitionTable';
import FractionTable from './FractionTable';


export default function AjustementModal({ setAjustement, ajustement }) {
  const navigate = useNavigate();
  let [data, setData] = useState([])
  let [loading, setLoading] = useState(true)

  const getAdaptedDose = (row)=>{
    // return 55.32;
    switch (data[2].Molecule.unite){
      case 'mg/kg':
        return data[2].dose * data[0].Patient.poids;
      case 'mg':
        return data[2].dose;
      case 'mg/m²':
        return data[2].dose * data[0].Patient.surfCorp;
      case 'AUC':
        return data[2].dose * (data[0].Patient.clairance + 25) ;
      default:
        return '-'
    }
  }

  useEffect(() => {
    //get all data
    axios.post(process.env.REACT_APP_SERVER_URL + '/getAjustementData', { prodId: ajustement })
      .then((res) => {
        console.log(res)
        setData(res.data)
        setLoading(false);
      })
      .catch(err=>{
        console.log(err)
      })
  }, [])

  const getVehicule = ()=>{
    if(!data[2].Vehicule){
      return;
    }
    let D = data[2].Vehicule;
    return D.contenu + ' ' + D.type + ' ' + D.volume + ' ml';
  }

  const getAdjustedDose = (num)=>{
      const val = Math.round(num / 0.2) * 0.2;
      return val.toFixed(2);
  }

  if(!data || loading){
    return '';
  }else{
  return (
    <div className="modal-container">
      <div className="modal-box ajustement-modal">
        <h2>Ajustement</h2>
        <div className="ajustement-header">
          <div className="field">
            <label>Patient: </label>
            <label className='main-label'>{data[0].Patient.nom + ' ' + data[0].Patient.prenom} </label>
          </div>
          <div className="doses">
            <div className="field">
              <label>Produit: </label>
              <label className='main-label'>{data[2].name} </label>
            </div>
            <div className="field">
              <label>Vehicule: </label>
              <label className='main-label'>{getVehicule()} </label>
            </div>
            <div className="field">
              <label>Concentration: </label>
              <label className='main-label'>{( getAdjustedDose(getAdaptedDose()) / parseInt(data[2]?.Vehicule?.volume) ).toFixed(2) } </label>
            </div>
          </div>
          <div className="field">
            <label>date: </label>
            <label className='main-label'>{data[2].startDate} </label>
          </div>
          <div className="doses">
            <div className="field">
              <label>Dose Prescrite: </label>
              <label className='main-label'>{getAdaptedDose() + ' ' + data[2].Molecule.unite} </label>
            </div>
            <div className="field">
              <label>Dose Ajustée: </label>
              <label className='main-label'>{getAdjustedDose(getAdaptedDose()) + ' ' + data[2].Molecule.unite} </label>
            </div>
            <div className="field">
              <label>Volume Ajusté: </label>
              <label className='main-label'>{getAdjustedDose(getAdaptedDose())} ml </label>
            </div>
            <div className="field">
              <label>Ratio: </label>
              <label className='main-label'>{ ( parseInt( getAdjustedDose(getAdaptedDose()) * 100 ) / getAdaptedDose() ).toFixed(2) + ' %' } </label>
            </div>
          </div>
        </div>
        <h2>Repartition</h2>
        <RepartitionTable data={data} adaptedDose={getAdaptedDose()} />
        <h3>Fraction</h3>
        <FractionTable data={data} adaptedDose={getAdaptedDose()} />
        <div className="btn-container">
          <button className="main-btn" onClick={()=>setAjustement(0)}>Annuler</button>
          <button className="main-btn" onClick={()=>setAjustement(0)}>Valider</button>
        </div>
      </div>
    </div>
  );
  }
}
