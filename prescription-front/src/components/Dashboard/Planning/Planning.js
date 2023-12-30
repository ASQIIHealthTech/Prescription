import { CircularProgress, Divider, Fab } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

export default function Planning({ patientId }) {
  const navigate = useNavigate();
  let [loading, setLoading] = useState(true);
  let [data, setData] = useState([]);
  let [patient, setPatient] = useState([]);
  let currentParentPres = null;

  useEffect(() => {
    axios
      .post(process.env.REACT_APP_SERVER_URL + "/getPlanning", { patientId })
      .then((res) => {
        setData(res.data[0]);
        setPatient(res.data[1]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getAge = (birthdate) => {
    const currentDate = new Date();
    const birthDate = new Date(birthdate);

    const yearsDiff = currentDate.getFullYear() - birthDate.getFullYear();

    // Adjust age if the birthdate hasn't occurred yet this year
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      return yearsDiff - 1;
    }

    return yearsDiff;
  };

  const addPres = ()=>{
    navigate('/dashboard?addpres=' + patientId)
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="planning-container">
      <div className="list-container">
        <h1>PLANNING DES PRESCRIPTIONS</h1>
        <div className="prescriptions">
          {data.length > 0 &&
            data.map((pres, index) => {
              console.log(pres.id_parent, currentParentPres)
              if(pres.id_parent != null && currentParentPres != pres.id_parent){
                currentParentPres = pres.id_parent;
                return (
                  <ParentPrescription pres={pres} index={index} data={data} />
                )
              }else if(pres.id_parent == null){
                return (
                  <Prescription pres={pres} index={index} />
                )
              }
          }
            )}
        </div>
      </div>
      <div className="fiche-patient">
        <Fab title="Ajouter une prescription" color="2663EE" aria-label="add" className="addPresBtn" onClick={()=>addPres()}>
            <img src="/icons/plus.png" alt="+" />
        </Fab>
        <div className="fiche-header">
          <label>PATIENT: { patient.prenom + ' ' + patient.nom}</label>
        </div>
        <div className="fiche-body">
          <div className="block">
            <div className="row">
              <label className="main-label">Genre : </label>
              <label className="info-label">{ patient.sexe } </label>
            </div>
            <div className="row">
              <label className="main-label">Age : </label>
              <label className="info-label">{ getAge(patient.birthDate) } ans </label>
            </div>
            <div className="row">
              <label className="main-label">Poids : </label>
              <label className="info-label">{ patient.poids } kg </label>
            </div>
            <div className="row">
              <label className="main-label">Taille : </label>
              <label className="info-label">{ patient.taille } cm </label>
            </div>
            <div className="row">
              <label className="main-label">Surface Corporelle : </label>
              <label className="info-label">{ patient.surfCorp } </label>
            </div>
            <div className="separator"></div>
          </div>
          <div className="block">
            <div className="row">
              <label className="main-label">Traitement en cours : </label>
              <label className="info-label">{data[0]?.Protocole?.protocole} </label>
            </div>
            <div className="row">
              <label className="main-label">Cure en cours : </label>
              <label className="info-label">Cure 1 </label>
            </div>
            <div className="separator"></div>
          </div>
          <div className="block">
            <div className="row">
              <label className="main-label">Commentaires : </label>
              <label className="info-label"> { patient.commentaire } </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ParentPrescription({ pres, index, data }){
  const navigate = useNavigate();
  let [prots, setProts] = useState([])

  useEffect(()=>{
    data.forEach(currPres=>{
      if(currPres.id_parent == pres.id_parent){
        setProts(prev=>[...prev, currPres])
      }
    })
  }, [])

  const showPrescriptions = (e, presId)=>{
    let el = e.target;
    let prescriptions = document.querySelectorAll("div[id_parent='"+ pres.id_parent +"']");
    prescriptions.forEach(element=>{
      element.classList.toggle('shown')
      if(element.childNodes[0].shown){
        //hide products if shown
        element.childNodes[0].click()
      }
    })
    if(el.shown){
      el.shown = 0;
      e.target.src = '/icons/plus_blue.png'
    }else{
      el.shown = 1;
      e.target.src = '/icons/minus_blue.png'
    }
  }

  // const navigatePrescription = (pres)=>{
  //   navigate('/prescription/'+pres);
  // }

  return(
    <>
    <div key={index} className="block parent-block">
      <img className="open-icon" onClick={(e)=>showPrescriptions(e, pres.id_parent)} src="/icons/plus_blue.png" />
      <div className="details">
        <img src="/icons/layers.png" />
        <label className="bold label1">
          Groupe Prescriptions :{" "}
        </label>
        <label className="label2">
          Protocole Parent: {pres?.Protocole?.parent}
        </label>
      </div>
    </div>
    {prots.length > 0 && prots.map((prot, protIndex) => (
      <Prescription pres={prot} index={protIndex} parent={true} />
    ))}
    </>
  )
}

export function Prescription({ pres, index, parent }){
  const navigate = useNavigate();
  let [currentDay, setCurrentDay] = useState('')

  const showCures = (e, presId)=>{
    let el = e.target;
    let cures = document.querySelectorAll("div[pres='"+ presId +"']");
    cures.forEach(element=>{
      element.classList.toggle('shown')
      if(element.childNodes[0].shown){
        //hide products if shown
        element.childNodes[0].click()
      }
    })
    if(el.shown){
      el.shown = 0;
      e.target.src = '/icons/plus_blue.png'
    }else{
      el.shown = 1;
      e.target.src = '/icons/minus_blue.png'
    }
  }

  const navigatePrescription = (pres)=>{
    navigate('/prescription/'+pres);
  }

  return(
    <>
    <div key={index} id_parent={pres.id_parent} className={"block parent-block " + (parent ? 'pres-parent' : '')}>
      <img className="open-icon" onClick={(e)=>showCures(e, pres.id)} src="/icons/plus_blue.png" />
      <div onClick={()=>navigatePrescription(pres.id)} className="details">
        <img src="/icons/prescription.png" />
        <label className="bold label1">
          Prescription-{index + 1} :{" "}
        </label>
        <label className="label2">
          Protocole {pres?.Protocole?.protocole}
        </label>
      </div>
    </div>
    {pres.Cures.length > 0 && pres.Cures.map((cure, cureIndex) => (
      <Cure cure={cure} presIndex={pres.id} cureIndex={cureIndex} currentDay={currentDay} setCurrentDay={setCurrentDay} />
    ))}
    </>
  )
}

export function Cure({ cure, presIndex, cureIndex, currentDay, setCurrentDay }){
  const navigate = useNavigate();
  let [addDay, setAddDay] = useState(false);
  let [groupedProducts, setgroupedProducts] = useState([])

  function getDateDifference(date1Str, date2Str) {
    var start = moment(date2Str, "YYYY-MM-DD");
    var end = moment(date1Str, "YYYY-MM-DD");

    //Difference in number of days
    return moment.duration(start.diff(end)).asDays();
  }

  const removeBtn = ()=>{

    return (
      <Fab title="Ajouter une prescription" color="2663EE" aria-label="add" className="addPresBtn" onClick={()=>addPres()}>
          <img src="/icons/plus.png" alt="+" />
      </Fab>
      )
  }

  useEffect(()=>{
    if(currentDay != cure.startDate){
      setAddDay(true)
      setCurrentDay(cure.startDate)
    }

    let firstDate = cure.startDate;

    if(groupedProducts.length == 0){
      for(const prod of cure.Products){
        let diff = getDateDifference(firstDate, prod.startDate) + 1;
        if(!groupedProducts[diff]){
          groupedProducts[diff] = [];
        }
        groupedProducts[diff].push(prod)
      }
    }
    
  }, [])

  const showProducts = (e, cureId, jour)=>{
    let el = e.target;
    let cures = document.querySelectorAll("div[cure='"+ cureId +"'][jour='"+ jour +"']");
    cures.forEach(element=>{
      element.classList.toggle('shown')
    })
    if(el.shown){
      el.shown = 0;
      e.target.src = '/icons/plus_blue.png'
    }else{
      el.shown = 1;
      e.target.src = '/icons/minus_blue.png'
    }
  }
  
  const showJours = (e, cureId)=>{
    let el = e.target;
    let cures = document.querySelectorAll("div[curej='"+ cureId +"']");
    cures.forEach(element=>{
      element.classList.toggle('shown')
      if(element.childNodes[0].shown){
        //hide products if shown
        element.childNodes[0].click()
      }
    })
    if(el.shown){
      el.shown = 0;
      e.target.src = '/icons/plus_blue.png'
    }else{
      el.shown = 1;
      e.target.src = '/icons/minus_blue.png'
    }
  }

  const navigateCure = (pres, cure)=>{
    navigate('/prescription/'+pres + '?cure=' + cure);
  }

  return(
    <>
    <div key={cureIndex} className="block child-block" pres={presIndex}>
      <Fab title="Supprimer la cure" color="2663EE" aria-label="add" className="removeCureBtn" onClick={()=>addPres()}>
          <img src="/icons/trash.png" alt="+" />
      </Fab>
      <img className="open-icon" onClick={(e)=>showJours(e, cure.id)} shown={0} src="/icons/plus_blue.png" />
      <div className="details" onClick={()=>navigateCure(presIndex, cureIndex)}>
        <img className="icon-24" src="/icons/cure.png" />
        <label className="bold label1">{cure.name} : </label>
        <label className="label2">{cure.startDate}</label>
        <label className="status">{cure.state}</label>
      </div>
    </div>
    {groupedProducts.length > 0 && groupedProducts.map((jour, index)=>(
      <>
        <div className="block child-block jour-block" presj={presIndex} curej={cure.id}>
          <img className="open-icon" onClick={(e)=>showProducts(e, cure.id, index)} shown={0} src="/icons/plus_blue.png" />
          <div className="details">
            <img className="icon-24" src="/icons/j.png" />
            <label className="bold label1">J{index} : </label>
            <label className="label2">{jour[0].startDate}</label>
            <label className="status">{cure.state}</label>
          </div>
        </div>
        {jour.length > 0 && jour.map((product, i)=>(
          <Product product={product} cureIndex={cure.id} jour={index} index={i} />
        ))}
      </>
    ))}
    </>
  )
}

export function Product({ product, index, cureIndex, jour }){
  return(
    <div cure={cureIndex} key={index} shown={0} jour={jour} className="block products-block">
      <div className="details details-product">
        <img className="icon-24" src="/icons/product.png" />
        <label className="bold label1">{product.name} : </label>
        <label className="label2">{product.startDate + ' - Dose: ' + product.dose + ' ' + product.Molecule.unite}</label>
      </div>
    </div>
  )
}