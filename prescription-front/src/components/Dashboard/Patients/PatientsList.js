import { DataGrid } from "@mui/x-data-grid";
import Fab from '@mui/material/Fab';
import { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

export default function PatientList({ addPatient, searchArgs, search, setSearch, setAddPrescription }) {
  const navigate = useNavigate();
  let [loading, setLoading] = useState(true);
  let [data, setData] = useState([]);
  let [rows, setRows] = useState([]);
  let [filteredRows, setFilteredRows] = useState([]);

  const prescriptionButton = (event)=>{
    return(
      <>
        <Fab className="add-prescription-btn" color="2663EE" aria-label="add" onClick={()=>addPrescription(event.row.id)}>
            <img src="/icons/plus.png" alt="+" />
        </Fab>
        <Fab className="planning-btn" color="2663EE" aria-label="planning" onClick={()=>navigate('/planning/'+event.row.id)}>
            <img src="/icons/list.svg" alt="+" />
        </Fab>
      </>
    ) 
  }
  
  const columns = [
    { field: "id", headerName: "ID", flex:1 },
    { field: "DDN", headerName: "DDN", flex:1 },
    { field: "DMI", headerName: "DMI", flex:1 },
    { field: "nom", headerName: "Nom", flex:1 },
    { field: "prenom", headerName: "Prenom", flex:1 },
    { field: "birthDate", headerName: "Date Naissance", flex:1 },
    { field: "sexe", headerName: "Sexe", flex:1 },
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
        setLoading(false)
      })
      .catch(err =>{
        console.log(err)
      })

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
        <h1>Liste Des Patients</h1>
        <Fab color="2663EE" aria-label="add" onClick={()=>addPatient()}>
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
          checkboxSelection
        /> : <CircularProgress /> }
      </div>
    </div>
  );
}
