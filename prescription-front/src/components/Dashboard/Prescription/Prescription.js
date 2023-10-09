import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import CureList from '../AddPrescription/CureList'
import axios from 'axios';
import ProductsList from "./ProductsList";
import { CircularProgress, Fab } from "@mui/material";
import { jsPDF } from "jspdf";
import ConfirmChangesModal from "./ConfirmChangesModal";

export default function Prescription({user}){
    const { presId } = useParams();
    let [loading, setLoading] = useState(true);
    let [selectedCure, setSelectedCure] = useState(0);
    let [data, setData] = useState([]);
    let [validateAll, setValidateAll] = useState(false);
    let [confirmChanges, setConfirmChanges] = useState(false);
    let [rows, setRows] = useState([])

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
        console.log(user)
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

    const exportPDF = async () => {
        const pdf = new jsPDF({
            orientation: "landscape",
            compress: true,
            format: [1760, 500], //Extra space at the end
        });
        const data = await document.querySelector("#toExportPDF");
        pdf.html(data).then(() => {
          pdf.save("shipping_label.pdf");
        });
      };

      const changeCommentaire = (e)=>{
        let commentaire = e.target.value;
        setData({
            ...data,
            commentaire
        })
        axios.post(process.env.REACT_APP_SERVER_URL + '/changePrescriptionCommentaire', { presId: data.id, commentaire})
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
                        <label className="main-label">Age: </label>
                        <label className="field-detail">{ getAge(data.Patient.birthDate) } ANS</label>
                    </div>
                    <div className="field">
                        <label className="main-label">Poids: </label>
                        <input type="number" readOnly className="main-input" value={data.Patient.poids} />
                    </div>
                </div>
                <div className="field-row">
                    <div className="field">
                        <label className="main-label">Taille: </label>
                        <input type="number" readOnly className="main-input" value={data.Patient.taille} />
                    </div>
                    <div className="field">
                        <label className="main-label">Créatinine: </label>
                        <input type="number" readOnly className="main-input" value={data.Patient.creatinine} />
                    </div>
                    <div className="field">
                        <label className="main-label">Formule: </label>
                        <select readOnly name="formuleClair" id="formuleClair" className="main-input" value={data.Patient.formuleClair}>
                            <option value=""></option>
                            <option value="mdrd">MDRD</option>
                            <option value="Cockroft">Cockroft</option>
                        </select>
                    </div>
                </div>
                <div className="field-row">
                    <div className="field">
                        <label className="main-label">Surface Corporelle: </label>
                        <input type="number" readOnly className="main-input" value={data.Patient.surfCorp} />
                    </div>
                    <div className="field clcr-field">
                        <label className="main-label">Clcr: </label>
                        <label className="field-detail">{data.Patient.clairance} ml/m</label>
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
                        <input type="date" className="main-input" onChange={changeCureDate} value={data.Cures[selectedCure].startDate} />
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
                <button className="main-btn save-btn" onClick={()=>setConfirmChanges(true)}>Enregistrer</button>
                <button className="main-btn validate-all-btn" onClick={()=>setValidateAll(true)}>Valider Tous Les Produits</button>
                <Fab className="pdf-btn" color="2663EE" aria-label="add" onClick={()=>exportPDF()}>
                    <img src="/icons/pdf.svg" alt="+" />
                </Fab>
                <Fab className="plus-btn" color="2663EE" aria-label="add" onClick={()=>console.log('CLICK')}>
                    <img src="/icons/plus.png" alt="+" />
                </Fab>
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