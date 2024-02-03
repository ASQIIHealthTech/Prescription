import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RepartitionTable from './RepartitionTable';
import FractionTable from './FractionTable';
import PocheModal from "./PocheModal";
import { CircularProgress } from '@mui/material';


export default function AjustementModal({ setAjustement, ajustement, rows }) {
  const navigate = useNavigate();
  let [data, setData] = useState([])
  let [prepMolecule, setPrepMolecule] = useState([])
  let [flacons, setFlacons] = useState([])
  let [loading, setLoading] = useState(true)
  let [poche, setPoche] = useState(0)
  let [vehData, setVehData] = useState(null)
  let [fractionDose, setFractionDose] = useState(0)
  let [volumePA, setVolumePA] = useState(0)
  let [ajustementData, setAjustementData] = useState({
    dillution: '',
    volume_dillution: '',
    cond_final: '',
    volume_solvant: null,
    volumePA: 0
  })


  let condFinalRef = useRef(0);
  let volumeSolvantRef = useRef(0);

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

  const getFlacons = (dci, productId)=>{
    setFlacons([]);
    axios.post(process.env.REACT_APP_SERVER_URL+'/getFlacons', { dci })
        .then(res=>{
            console.log(res)
            if(res.data.length == 0){
              setFlacons(prev=>[...prev, { productId , prepId: null, name: dci + ' ' + 50 + ' mg', dosage: 50, volume: 5, quantity: 0, fracQuantity: 0, fraction: 0 }])
            }else{
              res.data.forEach(flac=>{
                setFlacons(prev=>[...prev, { productId  , prepId: flac.id, name: flac.dci + ' ' + flac.dosage + ' mg', dosage: flac.dosage, volume: flac.volume, quantity: 0, fracQuantity: 0, fraction: 0 }])
              })
            }
        })
        .catch(err=>{
            console.log(err)
        })
  }

  useEffect(()=>{
    if(flacons){
      let total = 0;
      flacons.forEach(flac=>{
        total += flac.volume * (flac.quantity + flac.fraction);
      })
      setVolumePA(total);
      setAjustementData({
        ...ajustementData,
        volumePA: total
      });
    }
  }, [flacons])

  useEffect(() => {
    //get all data
    axios.post(process.env.REACT_APP_SERVER_URL + '/getAjustementData', { prodId: ajustement })
      .then((res) => {
        console.log(res)
        setData(res.data)
        setVehData(res.data[2].Vehicule)
        setPrepMolecule(res.data[3][0]);
        getFlacons(res.data[2].name, res.data[2].id);
        if(res.data[4]){
          setAjustementData(res.data[4])
        }
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
      const val = Math.round(num * 2) / 2;
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

    ajustementData.volume_final = ( (parseFloat(volumePA) + parseFloat(ajustementData.volume_solvant)).toFixed(2) ) > (parseInt(ajustementData.volume_dillution) + 50) ? (parseInt(ajustementData.volume_dillution) + 50) : ( (parseFloat(volumePA) + parseFloat(ajustementData.volume_solvant)).toFixed(2) );
      
    axios.post(process.env.REACT_APP_SERVER_URL+'/saveAjustement', { ajustementData, prodId: ajustement })
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
    setLoading(false);
    setAjustement(0);
  }

  const liberer = ()=>{
    data[2].liberer = 1;
    axios.post(process.env.REACT_APP_SERVER_URL+'/setLiberer', { id: data[2].id, value: 1 })
      .then(res=>{
        console.log(res)
        setLoading(true);
        submit();
      })
      .catch(err=>{
        console.log(err)
      })
  }

  const volumeDillChanged = (e)=>{
    let value = e.target.value;
    setAjustementData({
      ...ajustementData,
      volume_dillution: value,
      volume_solvant: value
    })
  }

  const dillChanged = (e)=>{
    let value = e.target.value;
    setAjustementData({
      ...ajustementData,
      dillution: value,
      cond_final: value
    })
  }
  
  const condFinalChanged = (e)=>{
    let value = e.target.value;
    setAjustementData({
      ...ajustementData,
      cond_final: value
    })
  }
  
  const volumeSolvantChanged = (e)=>{
    let value = e.target.value;
    if(parseInt(value) > parseInt(ajustementData.volume_dillution) + 50 ){
      return;
    }else{
      setAjustementData({
        ...ajustementData,
        volume_solvant: parseInt(value)
      })
    }
  }

  // const inputEmpty = ()=>{
  //   return ajustementData.dillution != '' && ajustementData.volume_dillution != '' && ajustementData.cond_final != '' && ajustementData.volume_solvant != '';
  //   return true
  // }

  const concRange = ()=>{
    let val = ( getAdjustedDose(getAdaptedDose()) / (( (parseFloat(volumePA) + parseFloat(ajustementData.volume_solvant)).toFixed(2) ) > (parseInt(ajustementData.volume_dillution) + 50) ? (parseInt(ajustementData.volume_dillution) + 50) : ( (parseFloat(volumePA) + parseFloat(ajustementData.volume_solvant)).toFixed(2) )) ).toFixed(2);
    return val >= prepMolecule.concentration_min && val <= prepMolecule.concentration_max;
  }

  if(!data || loading){
    return <CircularProgress />;
  }else if(poche != 0){
    return <PocheModal poche={poche} prepMolecule={prepMolecule} setPoche={setPoche} setVehData={setVehData} vehData={vehData} getAdjustedDose={getAdjustedDose} getAdaptedDose={getAdaptedDose} />;
  }else{
  return (
    <div className="modal-container">
      <div className="modal-box ajustement-modal">
        <h2>Ajustement</h2>
        <div className="ajustement-header">
          <div className="fields-row">
            <div className="field">
              <label>Patient: </label>
              <label className='main-label'>{data[0].Patient.nom + ' ' + data[0].Patient.prenom} </label>
            </div>
            <div className="field">
              <label>Produit: </label>
              <label className='main-label'>{data[2].name} </label>
            </div>
            <div className="field">
              <label>Date: </label>
              <label className='main-label'>{data[2].startDate} </label>
            </div>
          </div>

          <div className="fields-row justify-arround">
            <div className="field">
              <label>Dillution: </label>
              <select disabled={data[2].liberer == 1} value={ajustementData.dillution} onChange={(e)=>dillChanged(e)} className="main-input">
                <option value=""></option>
                <option value="Poche NaCl 0.9%">Poche NaCl 0.9%</option>
                <option value="Poche Glucose 5%">Poche Glucose 5%</option>
                <option value="Poche NaCl 0.9% sans PVC">Poche NaCl 0.9% sans PVC</option>
                <option value="Poche Glucose 5% sans PVC">Poche Glucose 5% sans PVC</option>
                <option value="Flacon NaCl 0.9%">Flacon NaCl 0.9%</option>
                <option value="Flacon Glucose 5%">Flacon Glucose 5%</option>
              </select>
            </div>
            <div className="field">
              <label>Volume dillution: </label>
              <select disabled={data[2].liberer == 1} value={ajustementData.volume_dillution} onChange={(e)=>volumeDillChanged(e)} className="main-input">
                <option value=""></option>
                <option value="100">100 ml</option>
                <option value="250">250 ml</option>
                <option value="500">500 ml</option>
                <option value="1000">1000 ml</option>
              </select>
            </div>
          </div>

          <div className="fields-row">
            <div className="field">
              <label>Sensibilité PVC: </label>
              <label className='main-label'>{prepMolecule.sensibilité_pvc ? "Oui" : 'Non' } </label>
            </div>
            <div className="field">
              <label>Sensibilité Lumière: </label>
              <label className='main-label'>{prepMolecule.abri_lumière ? "Oui" : 'Non' }</label>
            </div>
            <div className="field">
              <label>Dose prescrite: </label>
              <label className='main-label'>{getAdaptedDose().toFixed(2) } mg </label>
            </div>
            <div className="field">
              <label>Dose ajustée: </label>
              <label className='main-label'>{ getAdjustedDose(getAdaptedDose()) } mg </label>
            </div>
          </div>

          <div className="fields-row justify-arround">
            <div className="field">
              <label>Conditionnement final: </label>
              <select disabled={data[2].liberer == 1} onChange={(e)=>condFinalChanged(e)} value={ajustementData.cond_final} ref={condFinalRef} className="main-input">
                <option value=""></option>
                <option value="Poche NaCl 0.9%">Poche NaCl 0.9%</option>
                <option value="Poche NaCl 0.9% sans PVC">Poche NaCl 0.9% sans PVC</option>
                <option value="Flacon NaCl 0.9%">Flacon NaCl 0.9%</option>
                <option value="Poche Glucose 5%">Poche Glucose 5%</option>
                <option value="Poche Glucose 5% sans PVC">Poche Glucose 5% sans PVC</option>
                <option value="Flacon Glucose 5%">Flacon Glucose 5%</option>
                <option value="Seringue 1 ml">Seringue 1 ml</option>
                <option value="Seringue 2 ml">Seringue 2 ml</option>
                <option value="Seringue 5 ml">Seringue 5 ml</option>
                <option value="Seringue 50 ml">Seringue 50 ml</option>
              </select>
            </div>
            <div className="field">
              <label>Volume solvant: </label>
              <input disabled={data[2].liberer == 1} onChange={(e)=>volumeSolvantChanged(e)} value={ajustementData.volume_solvant}  ref={volumeSolvantRef} type="number" className="main-input" />
            </div>
          </div>

          <div className="fields-row">
            <div className="field">
              <label>Volume PA: </label>
              <label className='main-label'>{volumePA.toFixed(2)} ml </label>
            </div>
            <div className="field">
              <label>Volume PA Ajusté: </label>
              <label className='main-label'>{ getAdjustedDose(volumePA.toFixed(2))} ml </label>
            </div>
            <div className="field">
              <label>Ratio: </label>
              <label className='main-label'>{ ( parseInt( getAdjustedDose(getAdaptedDose()) * 100 ) / getAdaptedDose() ).toFixed(2) + ' %' }</label>
            </div>
          </div>

          <div className="fields-row justify-arround">
            <div className="field">
              <label>Volume final: </label>
              <label className='main-label'>{ ( (parseFloat(volumePA) + parseFloat(ajustementData.volume_solvant)).toFixed(2) ) > (parseInt(ajustementData.volume_dillution) + 50) ? (parseInt(ajustementData.volume_dillution) + 50) : ( (parseFloat(volumePA) + parseFloat(ajustementData.volume_solvant)).toFixed(2) )  } ml </label>
            </div>
            <div className="field">
              <div className='cc-container'>
                <div className='main-cc'>
                  <label>Concentration: </label>
                  <label className={'main-label' + (concRange() ? ' conc-green' : ' conc-red')}>{( getAdjustedDose(getAdaptedDose()) / (( (parseFloat(volumePA) + parseFloat(ajustementData.volume_solvant)).toFixed(2) ) > (parseInt(ajustementData.volume_dillution) + 50) ? (parseInt(ajustementData.volume_dillution) + 50) : ( (parseFloat(volumePA) + parseFloat(ajustementData.volume_solvant)).toFixed(2) )) ).toFixed(2) } mg/ml </label>
                </div>
                <div className='margin-cc'>
                  <label>CC min: <b>{prepMolecule.concentration_min} mg/ml </b> - </label>
                  <label>CC max: <b>{prepMolecule.concentration_max} mg/ml </b> </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h2 className='float-left'>Répartition</h2>
        <RepartitionTable fractionDose={fractionDose} setFractionDose={setFractionDose} data={data} flacons={flacons} setFlacons={setFlacons} adaptedDose={getAdaptedDose()} />
        <h2 className='float-left'>Fraction</h2>
        <FractionTable fractionDose={fractionDose} setFractionDose={setFractionDose} flacons={flacons} setFlacons={setFlacons} data={data} adaptedDose={getAdaptedDose()} />
        <div className="btn-container">
          <button className="main-btn" onClick={()=>setAjustement(0)}>Annuler</button>
          <button className="main-btn" onClick={()=>submit()}>Enregistrer</button>
          <button className="main-btn" onClick={()=>liberer()} >libérer</button>
        </div>
      </div>
    </div>
  );
  }
}
