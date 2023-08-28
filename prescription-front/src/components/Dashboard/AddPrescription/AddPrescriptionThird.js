import CureList from "./CureList";
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function AddPrescriptionThird({ patient, prescriptionData, setPrescriptionData }){
    let [protocole, setProtocole] = useState({})
    let [molecules, setMolecules] = useState({})

    useEffect(()=>{
        if(prescriptionData.protocole != ''){
            axios.post(process.env.REACT_APP_SERVER_URL + '/getMolecules', { id_protocole: prescriptionData.protocole })
                .then(res=>{
                    setProtocole(res.data[0])
                    setMolecules(res.data[1])
                })
        }
    }, [])

    return(
        <>
            <div className="prescription-third">
                <div className="row">
                    <div className="field">
                        <label className="main-label">Protocole : </label>
                        <label className="field-detail">{ protocole.protocole ? protocole.protocole : 'Sélectionner un protocole' }</label>
                    </div>
                    <div className="field">
                        <label className="main-label">Intercure : </label>
                        <label className="field-detail">{ protocole.intercure ? protocole.intercure + ' Jours' : 'Sélectionner un protocole'  }</label>
                    </div>
                    <div className="field">
                        <label className="main-label">Nbr Cures : </label>
                        <label className="field-detail">{ prescriptionData.nbrCures }</label>
                    </div>
                </div>
                <CureList molecules={molecules} patient={patient} />
            </div>
        </>
    )
}