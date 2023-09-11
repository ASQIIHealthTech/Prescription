import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

export default function Planning({ patientId }) {
  const navigate = useNavigate();
  let [loading, setLoading] = useState(true);
  let [data, setData] = useState([]);

  useEffect(() => {
    axios
      .post(process.env.REACT_APP_SERVER_URL + "/getPlanning", { patientId })
      .then((res) => {
        console.log('response from /getPlanning', res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="planning-container">
      <h1>PLANNING DES PRESCRIPTIONS</h1>
      <div className="prescriptions">
        {data.length > 0 &&
          data.map((pres, index) => (
            <Prescription pres={pres} index={index} />
          ))}
      </div>
    </div>
  );
}

export function Prescription({ pres, index }){
  console.log('prescription', pres.Protocole);
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
    <div key={index} className="block parent-block">
      <img className="open-icon" onClick={(e)=>showCures(e, pres.id)} src="/icons/plus_blue.png" />
      <div onClick={()=>navigatePrescription(pres.id)} className="details">
        <img src="/icons/prescription.png" />
        <label className="bold label1">
          Prescription-{index + 1} :{" "}
        </label>
        <label className="label2">
          Protocole {pres.Protocole.protocole}
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
  let [addDay, setAddDay] = useState(false);
  let [groupedProducts, setgroupedProducts] = useState([])

  function getDateDifference(date1Str, date2Str) {
    var start = moment(date2Str, "YYYY-MM-DD");
    var end = moment(date1Str, "YYYY-MM-DD");

    //Difference in number of days
    return moment.duration(start.diff(end)).asDays();
  }

  useEffect(()=>{
    console.log(currentDay, cure, cure.startDate)
    if(currentDay != cure.startDate){
      setAddDay(true)
      setCurrentDay(cure.startDate)
    }

    let firstDate = cure.startDate;

    for(const prod of cure.Products){
      let diff = getDateDifference(firstDate, prod.startDate) + 1;
      if(!groupedProducts[diff]){
        groupedProducts[diff] = [];
      }
      groupedProducts[diff].push(prod)
    }
    
    console.log(groupedProducts)
    
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

  return(
    <>
    <div key={cureIndex} className="block child-block" pres={presIndex}>
      <img className="open-icon" onClick={(e)=>showJours(e, cure.id)} shown={0} src="/icons/plus_blue.png" />
      <div className="details">
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
        <label className="label2">{product.startDate}</label>
      </div>
    </div>
  )
}