import { Divider } from "@mui/material";

export default function AddPrescriptionFirst({ patient, prescriptionData, setPrescriptionData, user }){

    const changeData = (e)=>{
        let field = e.target.attributes.name.nodeValue;
        let value = e.target.value;
        setPrescriptionData({
            ...prescriptionData,
            [field]: value
        })
    }

    return(
        <>
            <div className="patient-details">
                <div className="row">
                    <div className="field">
                        <label className="main-label">Patient : </label>
                        <label className="field-detail">{ patient.prenom + ' ' + patient.nom }</label>
                    </div>
                    <div className="field">
                        <label className="main-label">DMI : </label>
                        <label className="field-detail">{ patient.DMI }</label>
                    </div>
                </div>
                <div className="row">
                    <div className="field">
                        <label className="main-label">Date de Naissance : </label>
                        <label className="field-detail">{ patient.birthDate }</label>
                    </div>
                    <div className="field">
                        <label className="main-label">Genre : </label>
                        <label className="field-detail">{ patient.sexe }</label>
                    </div>
                </div>
            </div>
            <Divider orientation="horizontal" />
            <div className="prescription-details">
                <div className="row">
                    <label className="main-label">Nom du Prescripteur : </label>
                    <input onChange={changeData} defaultValue={user.name} className="main-input" type="text" name="prescripteur" id="prescripteur" />
                </div>
                <div className="row">
                    <label className="main-label">Date de la prescription : </label>
                    <input onChange={changeData} value={prescriptionData.date} className="main-input" type="date" name="date" id="datePres" />
                </div>
            </div>
        </>
    )
}