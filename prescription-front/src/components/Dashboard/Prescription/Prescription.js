import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom"
import CureList from '../AddPrescription/CureList'
import axios from 'axios';
import ProductsList from "./ProductsList";
import { CircularProgress, Fab } from "@mui/material";
import { jsPDF } from "jspdf";
import ConfirmChangesModal from "./ConfirmChangesModal";

export default function Prescription({user}){
    const navigate = useNavigate();
    const { presId } = useParams();
    const [params] = useSearchParams();
    let [loading, setLoading] = useState(true);
    let [selectedCure, setSelectedCure] = useState(0);
    let [data, setData] = useState([]);
    let [validateAll, setValidateAll] = useState(false);
    let [confirmChanges, setConfirmChanges] = useState(false);
    let [rows, setRows] = useState([])

    let clcrRef = useRef(null);
    let surfCorpRef = useRef(null);

    useEffect(() => {
        // Prompt confirmation when reload page is triggered
        window.onbeforeunload = () => { return "" };
            
        // Unmount the window.onbeforeunload event
        return () => { window.onbeforeunload = null };
      }, []);
      
    const refreshData = ()=>{
        setTimeout(()=>{
            axios.post(process.env.REACT_APP_SERVER_URL + '/getPrescription', { presId })
            .then((res)=>{
                setData(res.data)
                setLoading(false)
            })
        }, 500 )
    }

    useEffect(()=>{
        if(params.get('cure')){
            setSelectedCure(parseInt(params.get('cure')));
        }
        refreshData()
    }, [])

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

    
    const getClairance = () => {
        let clcr = 0;
        let sexe = data.Patient.sexe;
        let creatinine = parseInt(data.Patient.creatinine);
        let age = getAge(data.Patient.birthDate);
        let poids = data.Patient.poids;
        let formule = data.Patient.formuleClair;

        if (!(sexe && creatinine && age && poids)) {
        return;
        }

        if (formule == "mdrd") {
            if (sexe == "Homme") {
                clcr = (
                186 * Math.pow(creatinine / 88.4, -1.154) * Math.pow(age, -0.203)
                ).toFixed(2);
            } else if(sexe == "Femme") {
                clcr = (
                186 * Math.pow(creatinine / 88.4, -1.154) * Math.pow(age, -0.203) * 0.742
                ).toFixed(2);
            }
        } else if (formule == "cockroft") {
            if (sexe == "Homme") {
                clcr = ((1.23 * poids * (140 - age)) / creatinine).toFixed(2);
            } else if(sexe == "Femme") {
                clcr = ((1.04 * poids * (140 - age)) / creatinine).toFixed(2);
            }
        }else{
            clcr = 0;
        }

        return clcr;
    };

    let getSurfCorp = (poids, taille) => {
        return Math.sqrt((taille * poids) / 3600).toFixed(2);
    };

    const showCure = (id, prevu)=>{
        setSelectedCure(id)
    }

    const changeCureDate = (e)=>{
        let date = e.target.value;
        axios.post(process.env.REACT_APP_SERVER_URL + '/changeCureDate', { cureId: data.Cures[selectedCure].id, date})
            .then(res=>{
                setLoading(true)
                refreshData();
            })
            .catch(err=>{
                console.log(err)
            })
    }

    const changeCommentaire = (e)=>{
        let commentaire = e.target.value;
        setData({
            ...data,
            commentaire
        })
        axios.post(process.env.REACT_APP_SERVER_URL + '/changePrescriptionCommentaire', { presId: data.id, commentaire})
    }

    function isNumber(value) {
        return typeof value === 'number';
    }

    const changePatientData = (e, type)=>{
        let value = e.target.value;
        if(isNumber(data.Patient[type])){
            value = parseInt(value);
        }

        data.Patient[type] = value;

        let surfCorp = getSurfCorp(data.Patient.poids, data.Patient.taille);

        //limit to 2
        if(surfCorp > 2){
            surfCorp = 2;
        }

        if(type == 'surfCorp'){
            surfCorp = value;
        }

        if(type == 'poids' || type == 'taille'){
            surfCorpRef.current.value = surfCorp
            data.Patient.surfCorp = surfCorp
        }
        
        clcrRef.current.innerHTML = getClairance() + ' ml/m'; 
        data.Patient.clairance = getClairance();

        axios.post(process.env.REACT_APP_SERVER_URL + '/changePatientData', { id: data.Patient.id, type, value, surfCorp, clairance: getClairance()})
            .then(res => {
                e.target.classList.add('field-changed');
                refreshData()
            })
    }

    if(loading){
        return <CircularProgress />;
    }

    return(
        <>
        {confirmChanges && <ConfirmChangesModal setConfirmChanges={setConfirmChanges} cure={rows} refreshData={refreshData} user={user} />}
        <div className="prescription-details">
        <div className="patient">
                <h1>PATIENT : { data.Patient.nom + ' ' + data.Patient.prenom }</h1>
                <div className="field-row">
                    <div className="field">
                        <label className="main-label">Genre: </label>
                        <label className="field-detail">{ data.Patient.sexe }</label>
                    </div>
                    <div className="field">
                        <label className="main-label">DDN: </label>
                        <label className="field-detail">{data.Patient.birthDate + ' (' + getAge(data.Patient.birthDate)  } ANS)</label>
                    </div>
                    <div className="field">
                        <label className="main-label">Poids: </label>
                        <div className='kg-input-container'>
                            <input type="number" disabled={user.type != 'medecin'} className="main-input " onChange={(e)=>changePatientData(e, 'poids')} defaultValue={data.Patient.poids} />
                        </div>
                    </div>
                </div>
                <div className="field-row">
                    <div className="field">
                        <label className="main-label">Taille: </label>
                        <div className='cm-input-container'>
                            <input type="number" disabled={user.type != 'medecin'} className="main-input" onChange={(e)=>changePatientData(e, 'taille')} defaultValue={data.Patient.taille} />
                        </div>
                    </div>
                    <div className="field">
                        <label className="main-label">Créatinine: </label>
                        <div className='umol-input-container'>
                            <input type="number" disabled={user.type != 'medecin'} className="main-input" onBlur={(e)=>changePatientData(e, 'creatinine')} defaultValue={data.Patient.creatinine} />
                        </div>
                    </div>
                    <div className="field">
                        <label className="main-label">Formule: </label>
                        <select disabled={user.type != 'medecin'} name="formuleClair" id="formuleClair" className="main-input" onChange={(e)=>changePatientData(e, 'formuleClair')} defaultValue={data.Patient.formuleClair}>
                            <option value=""></option>
                            <option value="mdrd">MDRD</option>
                            <option value="cockroft">Cockroft</option>
                        </select>
                    </div>
                </div>
                <div className="field-row">
                    <div className="field">
                        <label className="main-label">Surface Corporelle: </label>
                        <div className='m2-input-container'>
                            <input disabled={user.type != 'medecin'} type="number" ref={surfCorpRef} className="main-input" onBlur={(e)=>changePatientData(e, 'surfCorp')} defaultValue={data.Patient.surfCorp} />
                        </div>
                    </div>
                    <div className="field clcr-field">
                        <label className="main-label">Clcr: </label>
                        <label disabled={user.type != 'medecin'} className="field-detail" ref={clcrRef} >{data.Patient.clairance} ml/min</label>
                    </div>
                </div>
            </div>
            <div className="cure">
                <h1>CURE Actuelle</h1>
                <div className="field-row">
                    <div className="field">
                        <label className="main-label">N Cure : </label>
                        <label className="field-detail">{selectedCure + 1 }</label>
                    </div>
                    <div className="field">
                        <label className="main-label">Date début cure {selectedCure + 1 } : </label>
                        <input type="date" disabled={user.type != 'medecin'} className="main-input" onChange={changeCureDate} value={data.Cures[selectedCure].startDate} />
                        <label className="main-label day-label">{new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(new Date(data.Cures[selectedCure].startDate))}</label>
                    </div>
                    <div className="field">
                        <label className="main-label">Status : </label>
                        <label className="field-detail">{data.Cures[selectedCure].state}</label>
                    </div>
                </div>
            </div>
            <div className="prescription">
                <h1>PRESCRIPTION / CURE</h1>
                <div className="field-row">
                    {data.essaiClin && (
                        <div className="field">
                            <label className="essaiClin-label"> Essai Clinique </label>
                        </div>
                    )}
                    <div className="field">
                        <label className="main-label">Protocole : </label>
                        <label className="field-detail">{ data.Protocole.protocole }</label>
                    </div>
                    <div className="field">
                        <label className="main-label">Nbr Cures : </label>
                        <label className="field-detail">{ data.nbrCures }</label>
                    </div>
                    <div className="field">
                        <label className="main-label">Intercure : </label>
                        <label className="field-detail">{ data.Protocole.intercure } Jours</label>
                    </div>
                    <div className="field">
                        <label className="main-label">Navigation entre les cures :</label>
                    </div>
                </div>
                <div className="cures-list">
                    <div className="cures">
                        {
                            data.Cures.map((cure, i)=>(
                                <div onClick={()=>showCure(i, cure.state == 'Prévu')} className={ 'cure' + (i == selectedCure ? ' selectedCure' : "")  }>
                                    {i + 1}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
        <div className="products-container">
            <div className="list-header">
                <h1>PRODUITS (CURE {selectedCure+1})</h1>
                <button className="main-btn save-btn" id="saveBtn" onClick={()=>setConfirmChanges(true)}>Enregistrer</button>
                {/* <button className="main-btn validate-all-btn" onClick={()=>setValidateAll(true)}>Valider Tous Les Produits</button> */}
                {
                    user.type == 'medecin' && (
                        <>
                            <Fab className="pdf-btn" color="2663EE" aria-label="add" onClick={()=>navigate('/fiche/'+presId)}>
                                <img src="/icons/pdf.svg" alt="+" />
                            </Fab>
                            <Fab className="plus-btn" color="2663EE" aria-label="add" onClick={()=>console.log('CLICK')}>
                                <img src="/icons/plus.png" alt="+" />
                            </Fab>
                        </>
                    )
                }
            </div>
            <ProductsList user={user} rows={rows} setRows={setRows} products={data.Cures[selectedCure].Products} cure={data.Cures[selectedCure]} patient={data.Patient} validateAll={validateAll} setValidateAll={setValidateAll} />
        </div>
        <div className="commentaire-container">
            <h1>Commentaire</h1>
            <textarea className="main-input commentaire-input" value={data.commentaire} onChange={changeCommentaire} />
        </div>
        </>
    )
}