import { DataGrid } from "@mui/x-data-grid";
import Fab from '@mui/material/Fab';
import { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PatientList({ addPatient, searchArgs, search, setSearch, setAddPrescription }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  let [loading, setLoading] = useState(true);
  let [data, setData] = useState([]);
  let [rows, setRows] = useState([]);
  let [filteredRows, setFilteredRows] = useState([]);

  const deletePatient = (patientId)=>{
    if(window.confirm('are you sure you want to delete this patient?')){
      axios.post(process.env.REACT_APP_SERVER_URL + '/deletePatient', { patientId })
      .then(res => {
        console.log(res.data)
        const newRows = rows.filter(item => item.id != patientId);
        console.log(111, newRows)
        setRows(newRows)
      })
      .catch(err =>{
        console.log(err)
      })
    }
  }

  const prescriptionButton = (event)=>{
    return(
      <>
        <Fab title="Ajouter une prescription" className="add-prescription-btn" color="2663EE" aria-label="add" onClick={()=>addPrescription(event.row.id)}>
            <img src="/icons/plus.png" alt="+" />
        </Fab>
        <Fab title="Planning des prescriptions" className="planning-btn" color="2663EE" aria-label="planning" onClick={()=>navigate('/planning/'+event.row.id)}>
            <img src="/icons/list.svg" alt="+" />
        </Fab>
        <Fab title="Planning des prescriptions" className="planning-btn" color="2663EE" aria-label="planning" onClick={()=>deletePatient(event.row.id)}>
            <img src="/icons/delete.svg" alt="+" />
        </Fab>
      </>
    ) 
  }
  
  const columns = [
    { field: "DMI", headerName: "DMI", flex:1 },
    { field: "index", headerName: "Index", flex:1 },
    { field: "nom", headerName: "Nom", flex:1 },
    { field: "prenom", headerName: "Prénom", flex:1 },
    { field: "birthDate", headerName: "Date Naissance", flex:1 },
    { field: "sexe", headerName: "Genre", flex:1 },
    { field: "prescription", headerName: "Prescription", align: 'center', flex:1, renderCell: prescriptionButton },
  ];

  const addPrescription = (id)=>{
    setAddPrescription(id)
  }
  
  useEffect(()=>{
    axios.post(process.env.REACT_APP_SERVER_URL + '/getAllPatients', {})
      .then(res => {
        setData(res.data);
        setRows(res.data);
        console.log(res.data)
        setLoading(false)
      })
      .catch(err =>{
        console.log(err)
      })

    let addpres = searchParams.get('addpres');
    
    if(addpres != 0){
      setAddPrescription(addpres)
    }
    

  }, [])

  useEffect(()=>{
    console.log('searching')
    filterRows();
    console.log(search)
  }, [search])

  function filterRows(){
    if(Object.keys(searchArgs).length == 0){
      setRows(data)
      return;
    }

    let searchKeys = Object.keys(searchArgs);
    filteredRows = []
    let valid = true;
    let done = false;

    data.forEach(el=>{
      valid = true;
      done = false;
      while(!done){
        searchKeys.forEach(key=>{
          if(!el[key].toString().toLowerCase().includes(searchArgs[key].toLowerCase())){
            valid = false;
            done = true;
          }
        })
        done = true
      }
      if(valid){
        filteredRows.push(el)
      }
    })
    setRows(filteredRows);
  }

  return (
    <div className="PatientList-container">
      <div className="list-header">
        <h1>Liste des patients</h1>
        <Fab title="Ajouter un Patient" color="2663EE" aria-label="add" onClick={()=>addPatient()}>
            <img src="/icons/plus.png" alt="+" />
        </Fab>
      </div>
      <div className="patient-list">
        {!loading ?
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          // checkboxSelection
        /> : <CircularProgress /> }
      </div>
    </div>
  );
}
