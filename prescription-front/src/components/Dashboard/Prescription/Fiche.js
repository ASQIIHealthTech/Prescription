import axios from "axios";
import { useEffect, useState } from "react";
import moment from 'moment';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ProductsList from "./ProductsList";

export default function Fiche ({user}){
    const navigate = useNavigate();
    const { presId } = useParams();
    const [Params, setParams] = useSearchParams();
    let [data, setData] = useState([]);
    let [loading, setLoading] = useState(true);
    let [rows, setRows] = useState([]);

    let today = moment().format('YYYY-MM-DD');

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

    useEffect(()=>{
        console.log(Params.get("selectedCure"))
        if(!Params || !Params.get("selectedCure") ){
            navigate('/Dashboard')
        }
        axios.post(process.env.REACT_APP_SERVER_URL + '/getPrescription', { presId })
        .then((res)=>{
            setData(res.data)
            setLoading(false)
            console.log(res.data)
        })
    }, [])

    if(loading){
        return;
    }else{
        return (
            <div className='fiche-container'>
                <div className="name-container">
                    <h4>Le {today} par {user.name}</h4>
                </div>
                <div className="fiche-body">
                    <label>Le(La)  patient(e) <b>{data.Patient.nom + ' ' + data.Patient.prenom }</b>  est agé(e) de <b>{getAge(data.Patient.birthDate)} ans</b>, <b>{data.Patient.commentaire}</b>. </label>
                    <br></br>
                    <label>Poids: <b>{data.Patient.poids} kg</b>  |  Taille: <b>{data.Patient.taille} cm</b>  |  Surface Corporelle: <b>{data.Patient.surfCorp} m²</b> </label>
                    <br></br>
                    <label>Creatinine: <b>{data.Patient.creatinine}</b>  |  Formule: <b>{data.Patient.formuleClair}</b>  |  Clairance de la créatinine: <b>{data.Patient.clairance} ml/min</b> </label>
                    <h3>Détails du traitements :</h3>
                    {/* <label>Primitif: <b>TBF</b></label> */}
                    {/* <br></br> */}
                    <label>Nom du Protocole: <b>{data.Protocole.protocole}</b></label>
                    <br></br>
                    <label>Intercure: <b>{data.Protocole.intercure} jours</b></label>
                    <br></br>
                    <label>Nombre de cures: <b>{data.nbrCures}</b></label>
                    <br></br>
                    <label>Date Debut traitement: <b>{data.startDate}</b></label>
                    <div className="fiche-list">
                        <ProductsList user={user} rows={rows} setRows={setRows} products={data.Cures[0].Products} cure={data.Cures[Params.get("selectedCure")]} patient={data.Patient} fiche={true} />
                    </div>
                </div>
            </div>
        )
    }

}