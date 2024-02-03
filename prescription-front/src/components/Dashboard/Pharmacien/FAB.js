import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FABTable from "./FABTable";
import axios from 'axios';
import { CircularProgress } from "@mui/material";
import moment from 'moment';

export default function FAB({ user }){
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    let [data, setData] = useState({});
    let [prepMolecule, setPrepMolecule] = useState({});
    let [patient, setPatient] = useState({});
    let [flacons, setFlacons] = useState({});
    let [loading, setLoading] = useState(true);
    let [totalVolume, setTotalVolume] = useState(0);
    let [volumeFinal, setVolumeFinal] = useState(0);

    let today = moment().format('YYYY-MM-DD');
    let [preDate, setPreDate] = useState(moment(today, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD'));

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

    const getPrepMolecule = (dci)=>{
        axios.post(process.env.REACT_APP_SERVER_URL+'/getPrepMolecule', { dci})
            .then(res=>{
                console.log(res)
                setPrepMolecule(res.data);
                if(res.data.délai_conservation_dilution){
                    setPreDate(moment(today, 'YYYY-MM-DD').add(parseInt(res.data.délai_conservation_dilution), 'days').format('YYYY-MM-DD'));
                }
            })
            .catch(err=>{
                console.log(err)
            })
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
                // if(!res.data.Vehicule.volume_finale){
                //     res.data.Vehicule.volume_finale = res.data.Vehicule.volume;
                // }
                setVolumeFinal( res.data.Ajustement.volume_final )
                setPatient(res.data.Cure.Prescription.Patient);
                getPrepMolecule(res.data.name);
                setLoading(false)
            })
            .catch((err)=>{
                console.log(err)
            })
            
        axios.post(process.env.REACT_APP_SERVER_URL + '/getSavedFlacons', { productId: ids })
            .then((res)=>{
                console.log(res.data)
                setFlacons(res.data)
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
                    <img src="ariana.png" height={100} />
                    <h1>FICHE DE FABRICATION</h1>
                    <label>N° ordonnancier: {data.id}</label>
                </div>
                <div className="patient-details">
                    <div className="patient fab-bg">
                        <h2>{patient.prenom + ' ' + patient.nom}</h2>
                        <div className="fields">
                            <div className="field">
                                <label className="main-label">DMI : </label>
                                <label className="info-label">{patient.DMI}</label>
                            </div>
                            <div className="field">
                                <label className="main-label">Index : </label>
                                <label className="info-label">{patient.index}</label>
                            </div>
                            <div className="field">
                                <label className="main-label">DDN : </label>
                                <label className="info-label">{patient.birthDate}</label>
                            </div>
                            <div className="field">
                                <label className="main-label">Genre : </label>
                                <label className="info-label">{patient.sexe}</label>
                            </div>
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
                    <div className="admin fab-bg">
                        <div className="fields">
                            <div className="field">
                                <label className="main-label">Produit : </label>
                                <label className="info-label">{data.name}</label>
                            </div>
                            <div className="field">
                                <label className="main-label">Protocole : </label>
                                <label className="info-label">{data.Cure.Prescription.Protocole.protocole}</label>
                            </div>
                            <div className="field">
                                <label className="main-label">Dose Prescrite : </label>
                                <label className="info-label">{getAdaptedDose(data.Molecule.unite, data.dose)} mg</label>
                            </div>
                            <div className="field">
                                <label className="main-label">Volume Final : </label>
                                <label className="info-label">{volumeFinal} ml</label>
                            </div>
                            <div className="field">
                                <label className="main-label">Concentration finale : </label>
                                <label className="info-label">{
                                    (getAdaptedDose(data.Molecule.unite, data.dose) / parseInt(volumeFinal).toFixed(2) > prepMolecule.concentration_min && getAdaptedDose(data.Molecule.unite, data.dose) / parseInt(volumeFinal).toFixed(2) < prepMolecule.concentration_max) ? (
                                        <label className="info-label conc-info">{(getAdaptedDose(data.Molecule.unite, data.dose) / parseInt(volumeFinal) ).toFixed(2) } mg/ml</label>
                                        ) : (
                                        <label className="info-label conc-info alert">{(getAdaptedDose(data.Molecule.unite, data.dose) / parseInt(volumeFinal) ).toFixed(2) } mg/ml</label>
                                    )}
                                </label>
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
                                <label className="info-label">Nom medecin</label>
                            </div>
                            <div className="field">
                                <label className="main-label">Validation : </label>
                                <label className="info-label">Nom Pharmacien</label>
                            </div>
                        </div>
                    </div>
                    {/* <div className="admin fab-bg">
                        <div className="fields">
                            
                        </div>
                    </div> */}
                </div>
                <FABTable totalVolume={totalVolume} setTotalVolume={setTotalVolume} flacons={flacons} data={data} prepMolecule={prepMolecule} adaptedDose={getAdaptedDose(data.Molecule.unite, data.dose)} />
                <div className="row fab-bg prep-data">
                    {/* <h2>Préparation</h2> */}
                    <div className="fields">
                        <div className="field">
                            <label className="main-label">Véhicule : </label>
                            <label className="info-label">{data.Ajustement.cond_final} | {data.Ajustement.volume_dillution} ml</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Volume final : </label>
                            <label className="info-label">{volumeFinal} ml</label>
                        </div>
                        <div className="field">
                            <label className="main-label conc-label">Volume a retirer : </label>
                            {/* <label className="info-label conc-info">{ (parseFloat(data.Vehicule.volume) - parseFloat(volumeFinal) + parseFloat(totalVolume)).toFixed(2) } ml</label> */}
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
                                <label className="info-label">{(prepMolecule.conservation_reconstitution_frigo == 'Oui' ) ? 'Frigo' : 'Non Frigo' } / {(prepMolecule.abri_lumière == 'oui' ) ? 'Abri Lumière' : 'Non Lumière' }</label>
                            </div>
                        </div>
                    </div>
                    {/* <div className="fourF fab-bg">
                        <div className="Frow FborderL">
                            <div className="field">
                                <label className="main-label">Preparation : </label>
                            </div>
                        </div>
                    </div> */}
                </div>

                <div className="row fab-bg sticker-data">
                    <div className="section header-section">
                        <div className="field">
                            <label className="main-label">Centre Hospitalier : </label>
                            <label className="info-label">Hôpital Abderrahmane MAMI</label>
                        </div>
                        <div className="field">
                            <label className="main-label">N° Ordonnancier : </label>
                            <label className="info-label">{data.id}</label>
                        </div>
                    </div>
                    <div className="fields border-bottom">
                        <div className="field">
                            <label className="main-label">Prescripteur : Dr Nom Medecin</label>
                        </div>
                        <div className="field">
                            <label className="main-label">DMI : </label>
                            <label className="info-label">{patient.DMI}</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Index : </label>
                            <label className="info-label">{patient.index}</label>
                        </div>
                        <div className="field">
                            <label className="main-label conc-label">DDN : </label>
                            <label className="info-label conc-info">{patient.birthDate}</label>
                        </div>
                    </div>
                    <div className="field">
                        <h2>{data.name}</h2>
                    </div>
                    <div className="fields">
                        <div className="field">
                            <label className="main-label">Dose : </label>
                            <label className="info-label">{data.dose} mg</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Volume Final : </label>
                            <label className="info-label">{volumeFinal} ml</label>
                        </div>
                        <div className="field">
                            <label className="main-label conc-label">Concentration : </label>
                            <label className="info-label conc-info">{(getAdaptedDose(data.Molecule.unite, data.dose) / parseInt(volumeFinal)).toFixed(2)} mg/ml</label>
                        </div>
                    </div>
                    <div className="fields border-bottom">
                        <div className="field">
                            <label className="main-label">Véhicule : </label>
                            <label className="info-label">{data.Ajustement.cond_final}</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Voie d'administration : </label>
                            <label className="info-label">{data.Molecule.voie}</label>
                        </div>
                        <div className="field">
                            <label className="main-label conc-label">Durée : </label>
                            <label className="info-label conc-info">{data.Molecule.duree_perfusion}</label>
                        </div>
                    </div>
                    <div className="fields">
                        <div className="field">
                            <label className="main-label">Date d'administration : </label>
                            <label className="info-label">{data.startDate}  J{getDateDifference(data.Cure.startDate, data.startDate) + 1}</label>
                        </div>
                        <div className="field">
                            <label className="main-label">N° de la cure : </label>
                            <label className="info-label">{data.Cure.name.split(' ')[1]}</label>
                        </div>
                    </div>
                    <div className="fields">
                        <div className="field">
                            <label className="main-label">Conservation : </label>
                            <label className="info-label">{(prepMolecule.conservation_reconstitution_frigo == 'Oui' ) ? 'Frigo' : 'Non Frigo' } / {(prepMolecule.abri_lumière == 'oui' ) ? 'Abri Lumière' : 'Non Lumière' }</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Date de fabrication : </label>
                            <label className="info-label">{today}</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Date de péremption : </label>
                            <label className="info-label">{preDate}</label>
                        </div>
                    </div>
                    <h2 className="alert">Ne pas Avaler - Respectez les doses prescrites - Uniquement sur ordonnance</h2>
                </div>
                
                <div className="row fab-bg sticker-data">
                    <div className="section header-section">
                        <div className="field">
                            <label className="main-label">Centre Hospitalier : </label>
                            <label className="info-label">Hôpital Abderrahmane MAMI</label>
                        </div>
                        <div className="field">
                            <label className="main-label">N° Ordonnancier : </label>
                            <label className="info-label">{data.id}</label>
                        </div>
                    </div>
                    <div className="fields border-bottom">
                        <div className="field">
                            <label className="main-label">Prescripteur : Dr Nom Medecin</label>
                        </div>
                        <div className="field">
                            <label className="main-label">DMI : </label>
                            <label className="info-label">{patient.DMI}</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Index : </label>
                            <label className="info-label">{patient.index}</label>
                        </div>
                        <div className="field">
                            <label className="main-label conc-label">DDN : </label>
                            <label className="info-label conc-info">{patient.birthDate}</label>
                        </div>
                    </div>
                    <div className="field">
                        <h2>{data.name}</h2>
                    </div>
                    <div className="fields">
                        <div className="field">
                            <label className="main-label">Dose : </label>
                            <label className="info-label">{data.dose} mg</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Volume Final : </label>
                            <label className="info-label">{volumeFinal} ml</label>
                        </div>
                        <div className="field">
                            <label className="main-label conc-label">Concentration : </label>
                            <label className="info-label conc-info">{(getAdaptedDose(data.Molecule.unite, data.dose) / parseInt(volumeFinal)).toFixed(2)} mg/ml</label>
                        </div>
                    </div>
                    <div className="fields border-bottom">
                        <div className="field">
                            <label className="main-label">Véhicule : </label>
                            <label className="info-label">{data.Ajustement.cond_final}</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Voie d'administration : </label>
                            <label className="info-label">{data.Molecule.voie}</label>
                        </div>
                        <div className="field">
                            <label className="main-label conc-label">Durée : </label>
                            <label className="info-label conc-info">{data.Molecule.duree_perfusion}</label>
                        </div>
                    </div>
                    <div className="fields">
                        <div className="field">
                            <label className="main-label">Date d'administration : </label>
                            <label className="info-label">{data.startDate}  J{getDateDifference(data.Cure.startDate, data.startDate) + 1}</label>
                        </div>
                        <div className="field">
                            <label className="main-label">De la cure n° : </label>
                            <label className="info-label">{data.Cure.name.split(' ')[1]}</label>
                        </div>
                    </div>
                    <div className="fields">
                        <div className="field">
                            <label className="main-label">Conservation : </label>
                            <label className="info-label">{(prepMolecule.conservation_reconstitution_frigo == 'Oui' ) ? 'Frigo' : 'Non Frigo' } / {(prepMolecule.abri_lumière == 'oui' ) ? 'Abri Lumière' : 'Non Lumière' }</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Date de fabrication : </label>
                            <label className="info-label">{today}</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Date de péremption : </label>
                            <label className="info-label">{preDate}</label>
                        </div>
                    </div>
                    <h2 className="alert">Ne pas Avaler - Respectez les doses prescrites - Uniquement sur ordonnance</h2>
                </div>
                
                <div className="row fab-bg sticker-data">
                    <div className="section header-section">
                        <div className="field">
                            <label className="main-label">Centre Hospitalier : </label>
                            <label className="info-label">Hôpital Abderrahmane MAMI</label>
                        </div>
                        <div className="field">
                            <label className="main-label">N° Ordonnancier : </label>
                            <label className="info-label">{data.id}</label>
                        </div>
                    </div>
                    <div className="fields border-bottom">
                        <div className="field">
                            <label className="main-label">Prescripteur : Dr Nom Medecin</label>
                        </div>
                        <div className="field">
                            <label className="main-label">DMI : </label>
                            <label className="info-label">{patient.DMI}</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Index : </label>
                            <label className="info-label">{patient.index}</label>
                        </div>
                        <div className="field">
                            <label className="main-label conc-label">DDN : </label>
                            <label className="info-label conc-info">{patient.birthDate}</label>
                        </div>
                    </div>
                    <div className="field">
                        <h2>{data.name}</h2>
                    </div>
                    <div className="fields">
                        <div className="field">
                            <label className="main-label">Dose : </label>
                            <label className="info-label">{data.dose} mg</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Volume Final : </label>
                            <label className="info-label">{volumeFinal} ml</label>
                        </div>
                        <div className="field">
                            <label className="main-label conc-label">Concentration : </label>
                            <label className="info-label conc-info">{(getAdaptedDose(data.Molecule.unite, data.dose) / parseInt(volumeFinal)).toFixed(2)} mg/ml</label>
                        </div>
                    </div>
                    <div className="fields border-bottom">
                        <div className="field">
                            <label className="main-label">Véhicule : </label>
                            <label className="info-label">{data.Ajustement.cond_final}</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Voie d'administration : </label>
                            <label className="info-label">{data.Molecule.voie}</label>
                        </div>
                        <div className="field">
                            <label className="main-label conc-label">Durée : </label>
                            <label className="info-label conc-info">{data.Molecule.duree_perfusion}</label>
                        </div>
                    </div>
                    <div className="fields">
                        <div className="field">
                            <label className="main-label">Date d'administration : </label>
                            <label className="info-label">{data.startDate}  J{getDateDifference(data.Cure.startDate, data.startDate) + 1}</label>
                        </div>
                        <div className="field">
                            <label className="main-label">De la cure n° : </label>
                            <label className="info-label">{data.Cure.name.split(' ')[1]}</label>
                        </div>
                    </div>
                    <div className="fields">
                        <div className="field">
                            <label className="main-label">Conservation : </label>
                            <label className="info-label">{(prepMolecule.conservation_reconstitution_frigo == 'Oui' ) ? 'Frigo' : 'Non Frigo' } / {(prepMolecule.abri_lumière == 'oui' ) ? 'Abri Lumière' : 'Non Lumière' }</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Date de fabrication : </label>
                            <label className="info-label">{today}</label>
                        </div>
                        <div className="field">
                            <label className="main-label">Date de péremption : </label>
                            <label className="info-label">{preDate}</label>
                        </div>
                    </div>
                    <h2 className="alert">Ne pas Avaler - Respectez les doses prescrites - Uniquement sur ordonnance</h2>
                </div>
            </div>
        </div>
    )
}