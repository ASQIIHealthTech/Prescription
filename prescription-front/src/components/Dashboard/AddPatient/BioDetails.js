export default function BioDetails({ handleBack, handleComplete }){
    return(
        <div className='bio-details'>
            <div className="field">
                <label className="main-label">Albumine (g/l)</label>
                <input type="number" className="main-input" />
                <input type="date" className="main-input" />
            </div>
            <div className="field">
                <label className="main-label">Globules blancs (giga/l)</label>
                <input type="number" className="main-input" />
                <input type="date" className="main-input" />
            </div>
            <div className="field">
                <label className="main-label">ASAT (UI/l)</label>
                <input type="number" className="main-input" />
                <input type="date" className="main-input" />
            </div>
            <div className="field">
                <label className="main-label">Polynucléaires (giga/l)</label>
                <input type="number" className="main-input" />
                <input type="date" className="main-input" />
            </div>
            <div className="field">
                <label className="main-label">ALAT (UI/l)</label>
                <input type="number" className="main-input" />
                <input type="date" className="main-input" />
            </div>
            <div className="field">
                <label className="main-label">Hématies (tera/l)</label>
                <input type="number" className="main-input" />
                <input type="date" className="main-input" />
            </div>
            <div className="field">
                <label className="main-label">Bilirubine (µmol/l)</label>
                <input type="number" className="main-input" />
                <input type="date" className="main-input" />
            </div>
            <div className="field">
                <label className="main-label">Hémoglobine (g/l)</label>
                <input type="number" className="main-input" />
                <input type="date" className="main-input" />
            </div>
            <div className="field">
                <label className="main-label">Cystatinémie (mg/l)</label>
                <input type="number" className="main-input" />
                <input type="date" className="main-input" />
            </div>
            <div className="field">
                <label className="main-label">Plaquettes (giga/l)</label>
                <input type="number" className="main-input" />
                <input type="date" className="main-input" />
            </div>
            <h2>Fonction Renale</h2>
            <div className="field">
                <label className="main-label">Créatininémie (µmol/l)</label>
                <input type="number" className="main-input" />
                <input type="date" className="main-input" />
            </div>
            <div className="btn-container">
                <button className="main-btn" onClick={()=>handleBack()}>Précédent</button>
                <button className="main-btn" onClick={()=>handleComplete()}>Enregistrer</button>
            </div>
        </div>
        )
}