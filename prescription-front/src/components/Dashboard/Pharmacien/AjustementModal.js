import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RepartitionTable from './RepartitionTable';
import FractionTable from './FractionTable';
import PocheModal from "./PocheModal";


export default function AjustementModal({ setAjustement, ajustement, rows }) {
  const navigate = useNavigate();
  let [data, setData] = useState([])
  let [prepMolecule, setPrepMolecule] = useState([])
  let [flacons, setFlacons] = useState([])
  let [loading, setLoading] = useState(true)
  let [poche, setPoche] = useState(0)
  let [vehData, setVehData] = useState(null)

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

  const getPrepMolecule = (dci)=>{
    axios.post(process.env.REACT_APP_SERVER_URL+'/getPrepMolecule', { dci})
        .then(res=>{
            console.log(res)
            setPrepMolecule(res.data);
        })
        .catch(err=>{
            console.log(err)
        })
  }

  const getFlacons = (dci, productId)=>{
    setFlacons([]);
    axios.post(process.env.REACT_APP_SERVER_URL+'/getFlacons', { dci })
        .then(res=>{
            console.log(res)
            if(res.data.length == 0){
              setFlacons(prev=>[...prev, { productId , prepId: null, name: dci + ' ' + 50 + ' mg', dosage: 50, volume: 5, quantity: 0 }])
            }else{
              res.data.forEach(flac=>{
                setFlacons(prev=>[...prev, { productId  , prepId: flac.id, name: flac.dci + ' ' + flac.dosage + ' mg', dosage: flac.dosage, volume: flac.dosage / 10, quantity: 0 }])
              })
            }
        })
        .catch(err=>{
            console.log(err)
        })
  }

  useEffect(() => {
    //get all data
    axios.post(process.env.REACT_APP_SERVER_URL + '/getAjustementData', { prodId: ajustement })
      .then((res) => {
        console.log(res)
        setData(res.data)
        setVehData(res.data[2].Vehicule)
        getPrepMolecule(res.data[2].name);
        getFlacons(res.data[2].name, res.data[2].id);
        setLoading(false);
      })
      .catch(err=>{
        console.log(err)
      })
  }, [])

  const getVehicule = ()=>{
    if(!vehData){
      return;
    }
    let D = vehData;
    return D.contenu + ' ' + D.type + ' ' + D.volume + ' ml';
  }

  const getAdjustedDose = (num)=>{
      const val = Math.round(num / 0.2) * 0.2;
      return val.toFixed(2);
  }

  const flaskBtn = (id)=>(
    <img className="gear-icon" src="/icons/flask.png" onClick={()=>openPoche(id)} />
  )
    
  const openPoche = (id)=>{
    setPoche(id);
  }

  const submit = ()=>{
    axios.post(process.env.REACT_APP_SERVER_URL+'/setAdjusted', { id: data[2].id, value: 1 })
      .then(res=>{
        console.log(res)
      })
      .catch(err=>{
        console.log(err)
      })
      
    axios.post(process.env.REACT_APP_SERVER_URL+'/saveFlacons', { flacons })
      .then(res=>{
        console.log(res)
      })
      .catch(err=>{
        console.log(err)
      })
    
    for(let el of rows){
      if(el.id == ajustement){
        el.adjusted = 1;
      }
    }
    setAjustement(0);
  }

  if(!data || loading){
    return '';
  }else if(poche != 0){
    return <PocheModal poche={poche} prepMolecule={prepMolecule} setPoche={setPoche} setVehData={setVehData} vehData={vehData} getAdjustedDose={getAdjustedDose} getAdaptedDose={getAdaptedDose} />;
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
              {flaskBtn(data[2].id)}
              { !vehData ? null : (
                <>
                  <div className="field">
                    <label>Vehicule: </label>
                      <label className='main-label'>{getVehicule()} </label>
                    </div>
                    <div className="field">
                      <label>Concentration: </label>
                      <label className='main-label'>{( getAdjustedDose(getAdaptedDose()) / parseInt(vehData?.volume) ).toFixed(2) } mg/ml</label>
                    </div>
                </>
              )
            }
          </div>
          <div className="field">
            <label>date: </label>
            <label className='main-label'>{data[2].startDate} </label>
          </div>
          <div className="doses">
            <div className="field">
              <label>Dose Prescrite: </label>
              <label className='main-label'>{getAdaptedDose().toFixed(2) } mg </label>
            </div>
            <div className="field">
              <label>Dose Ajustée: </label>
              <label className='main-label'>{getAdjustedDose(getAdaptedDose()) } mg </label>
            </div>
            <div className="field">
              <label>Volume Ajusté: </label>
              <label className='main-label'>{getAdjustedDose(getAdaptedDose()) / 10} ml </label>
            </div>
            <div className="field">
              <label>Ratio: </label>
              <label className='main-label'>{ ( parseInt( getAdjustedDose(getAdaptedDose()) * 100 ) / getAdaptedDose() ).toFixed(2) + ' %' } </label>
            </div>
          </div>
        </div>
        <h2 className='float-left'>Repartition</h2>
        <RepartitionTable data={data} flacons={flacons} setFlacons={setFlacons} adaptedDose={getAdaptedDose()} />
        <h2 className='float-left'>Fraction</h2>
        <FractionTable flacons={flacons} setFlacons={setFlacons} data={data} adaptedDose={getAdaptedDose()} />
        <div className="btn-container">
          <button className="main-btn" onClick={()=>setAjustement(0)}>Annuler</button>
          <button className="main-btn" disabled={!vehData} onClick={()=>submit()}>Enregistrer</button>
          <button className="main-btn" disabled={!vehData} >libérer</button>
        </div>
      </div>
    </div>
  );
  }
}
