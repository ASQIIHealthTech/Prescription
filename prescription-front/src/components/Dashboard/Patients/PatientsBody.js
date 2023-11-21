import PatientList from './PatientsList';
import SearchBlock from './SearchBlock';
import { useNavigate } from 'react-router-dom';
import AddPatient from '../AddPatient/AddPatient'
import { useState } from 'react';
import AddPrescription from '../AddPrescription/AddPrescription';

export default function PatientsBody({ user }){
    const navigate = useNavigate();
    
    let [addingPatient, setAddingPatient] = useState(false)
    let [searchArgs, setSearchArgs] = useState({});
    //Search is filtering everytime the value changes (does not matter false or true)
    let [search, setSearch] = useState(false);
    let [addPrescription, setAddPrescription] = useState(null);

    const addPatient = ()=>{
        setAddingPatient(true);
    }

    return(
        <>
            { addPrescription != null && <AddPrescription user={user} addPrescription={addPrescription} setAddPrescription={setAddPrescription} /> }
            {!addingPatient && <SearchBlock setSearch={setSearch} searchArgs={searchArgs} />}
            {addingPatient ? <AddPatient setAddingPatient={setAddingPatient} /> : <PatientList setAddPrescription={setAddPrescription} search={search} setSearch={setSearch} searchArgs={searchArgs} addPatient={addPatient} />}
        </>
        )
}