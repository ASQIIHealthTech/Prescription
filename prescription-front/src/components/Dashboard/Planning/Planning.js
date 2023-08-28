import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Planning({ patientId }) {
  const navigate = useNavigate();
  let [loading, setLoading] = useState(true);
  let [data, setData] = useState([]);

  useEffect(() => {
    axios
      .post(process.env.REACT_APP_SERVER_URL + "/getPlanning", { patientId })
      .then((res) => {
        console.log(res);
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
  
  const showCures = (e, presId)=>{
    let el = e.target;
    let cures = document.querySelectorAll("div[pres='"+ presId +"']");
    console.log(cures)
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

  return(
    <>
    <div key={index} className="block parent-block">
      <img className="open-icon" onClick={(e)=>showCures(e, pres.id)} src="/icons/plus_blue.png" />
      <div className="details">
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
      <Cure cure={cure} presIndex={pres.id} cureIndex={cureIndex} />
    ))}
    </>
  )
}

export function Cure({ cure, presIndex, cureIndex }){
    
  const showProducts = (e, cureId)=>{
    let el = e.target;
    let cures = document.querySelectorAll("div[cure='"+ cureId +"']");
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

  return(
    <>
    <div key={cureIndex} className="block child-block" pres={presIndex}>
      <img className="open-icon" onClick={(e)=>showProducts(e, cure.id)} shown={0} src="/icons/plus_blue.png" />
      <div className="details">
        <img className="icon-24" src="/icons/cure.png" />
        <label className="bold label1">{cure.name} : </label>
        <label className="label2">{cure.startDate}</label>
        <label className="status">{cure.state}</label>
      </div>
    </div>
    {cure.Products.length > 0 && cure.Products.map((product, i)=>(
      <Product product={product} cureIndex={cure.id} index={i} />
    ))}
    </>
  )
}

export function Product({ product, index, cureIndex }){
  return(
    <div cure={cureIndex} key={index} shown={0} className="block products-block">
      <div className="details details-product">
        <img className="icon-24" src="/icons/product.png" />
        <label className="bold label1">{product.name} : </label>
        <label className="label2">{product.startDate}</label>
      </div>
    </div>
  )
}