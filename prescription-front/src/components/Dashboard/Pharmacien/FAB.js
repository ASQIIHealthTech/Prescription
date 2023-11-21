import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FABTable from "./FABTable";
import axios from 'axios';
import { CircularProgress } from "@mui/material";
import moment from 'moment';

export default function FAB(){
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    let [data, setData] = useState({});
    let [patient, setPatient] = useState({});
    let [loading, setLoading] = useState(true);

    let today = moment().format('YYYY-MM-DD');
    let preDate = moment(today, 'YYYY-MM-DD').add(2, 'days').format('YYYY-MM-DD');

    function getDateDifference(date1Str, date2Str) {
        var start = moment(date2Str, "YYYY-MM-DD");
        var end = moment(date1Str, "YYYY-MM-DD");
    
        //Difference in number of days
        return moment.duration(start.diff(end)).asDays();
    }

    const getAdaptedDose = (unite, dose)=>{
        switch (unite){
          case 'mg/kg':
            return dose * patient.poids;
          case 'mg':
            return dose;
          case 'mg/m²':
            return dose * patient.surfCorp;
          case 'AUC':
            return dose * (patient.clairance + 25) ;
          default:
            return '-'
        }
      }

    useEffect(()=>{
        let ids = searchParams.get('ids');
        if(!ids){
            navigate('/dashboard')
        }
        axios.post(process.env.REACT_APP_SERVER_URL + '/getFABData', { ids })
            .then((res)=>{
                console.log(res.data)
                setData(res.data);
                setPatient(res.data.Cure.Prescription.Patient);
                setLoading(false)
            })
            .catch((err)=>{
                console.log(err)
            })
    }, [])

    if(loading){
        return (<CircularProgress />)
    }

    return (
        <div className="FAB-container">
            <div className="fiche">
                <div className="row fab-header">
                    <h2>Centre hospitalier</h2>
                    <h1>FICHE DE FABRICATION</h1>
                    <label>N° ordonnancier</label>
                </div>
                <div className="row fab-bg prod-details">
                    <div className="field">
                        <label className="main-label">Produit : </label>
                        <label className="info-label">{data.name}</label>
                    </div>
                    <div className="field">
                        <label className="main-label">Protocole : </label>
                        <label className="info-label">{data.Cure.Prescription.Protocole.protocole}</label>
                    </div>
                </div>
                <div className="patient-details">
                    <div className="patient fab-bg">
                        <h2>{patient.prenom + ' ' + patient.nom}</h2>
                        <div className="fields">
                            <div className="field">
                                <label className="main-label">ID Patient : </label>
                                <label className="info-label">{patient.id}</label>
                            </div>
                            <div className="field">
                                <label className="main-label">DDN : </label>
                                <label className="info-label">{patient.birthDate}</label>
                            </div>
                            <div className="field">
                                <label className="main-label">Genre : </label>
                                <label className="info-label">{patient.sexe}</label>
                            </div>
                        </div>
                    </div>
                    <div className="admin fab-bg">
                        <div className="fields">
                            <div className="field">
                                <label className="main-label">Date d'administration : </label>
                                <label className="info-label">{today}</label>
                            </div>
                            <div className="field">
                                <label className="main-label">Jour d'administration : </label>
                                <label className="info-label">J{getDateDifference(data.Cure.startDate, data.startDate) + 1}</label>
                            </div>
                            <div className="field">
                                <label className="main-label">N° de cure : </label>
                                <label className="info-label">{ data.Cure.name.split(' ')[1] }</label>
                            </div>
                            <div className="field">
                                <label className="main-label">Prescripteur : </label>
                                <label className="info-label">DR Mghirbi</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row fab-bg patient-data">
                    <div className="fields">
                        <div className="field">
                            <label className="main-label">Poids : </label>
                            <label className="info-label">{patient.poids} kg</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Taille : </label>
                            <label className="info-label">{patient.taille} cm</label>
                        </div>
                        <div className="field">
                            <label className="main-label">SC : </label>
                            <label className="info-label">{patient.surfCorp} m²</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Creatinémie : </label>
                            <label className="info-label">{patient.creatinine} µmol/L</label>
                        </div>
                    </div>
                </div>
                <div className="row fab-bg dose-data">
                    <div className="fields">
                        <div className="field">
                            <label className="main-label">Dose Prescrite : </label>
                            <label className="info-label">{getAdaptedDose(data.Molecule.unite, data.dose)} mg</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Volume Final : </label>
                            <label className="info-label">{data.Vehicule.volume} ml</label>
                        </div>
                        <div className="field">
                            <label className="main-label conc-label">Concentration finale : </label>
                            <label className="info-label conc-info">{getAdaptedDose(data.Molecule.unite, data.dose) / parseInt(data.Vehicule.volume).toFixed(2) } mg/ml</label>
                        </div>
                    </div>
                </div>
                <FABTable data={data} adaptedDose={getAdaptedDose(data.Molecule.unite, data.dose)} />
                <div className="row fab-bg prep-data">
                    <h2>Préparation</h2>
                    <div className="fields">
                        <div className="field">
                            <label className="main-label">Véhicule : </label>
                            <label className="info-label">{data.Vehicule.contenu}</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Volume : </label>
                            <label className="info-label">{data.Vehicule.volume} ml</label>
                        </div>
                        <div className="field">
                            <label className="main-label conc-label">Volume a retirer : </label>
                            <label className="info-label conc-info">--</label>
                        </div>
                    </div>
                </div>
                <div className="last-details">
                    <div className="fab fab-bg">
                        <div className="fields">
                            <div className="field"> 
                                <label className="main-label">Date de fabrication : </label>
                                <label className="info-label">{today}</label>
                            </div>
                            <div className="field">
                                <label className="main-label">Date de préremption : </label>
                                <label className="info-label">{preDate}</label>
                            </div>
                            <div className="field">
                                <label className="main-label">Conservation : </label>
                                <label className="info-label">---</label>
                            </div>
                        </div>
                    </div>
                    <div className="fourF fab-bg">
                        <div className="Frow FborderL">
                            <div className="field">
                                <label className="main-label">Préparateur : </label>
                                <label className="info-label">XX</label>
                            </div>
                            <div className="field">
                                <label className="main-label">Ajustement : </label>
                                <label className="info-label">XX</label>
                            </div>
                        </div>
                        <div className="Frow">
                            <div className="field">
                                <label className="main-label">Validation : </label>
                                <label className="info-label">XX</label>
                            </div>
                            <div className="field">
                                <label className="main-label">Controle : </label>
                                <label className="info-label">XX</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="row fab-bg sticker-data">
                    <div className="section header-section">
                        <div className="field">
                            <label className="main-label">Centre Hospitalier : </label>
                            <label className="info-label">adresse</label>
                        </div>
                        <div className="field">
                            <label className="main-label">N° Ordonnancier : </label>
                            <label className="info-label">adresse</label>
                        </div>
                    </div>
                    <div className="fields">
                        <div className="field">
                            <label className="main-label">Véhicule : </label>
                            <label className="info-label">{data.Vehicule.contenu}</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Volume : </label>
                            <label className="info-label">{data.Vehicule.volume} ml</label>
                        </div>
                        <div className="field">
                            <label className="main-label conc-label">Volume a retirer : </label>
                            <label className="info-label conc-info">--</label>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}