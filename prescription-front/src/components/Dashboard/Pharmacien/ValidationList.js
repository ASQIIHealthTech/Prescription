import { DataGrid } from "@mui/x-data-grid";
import Fab from '@mui/material/Fab';
import { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

export default function ValidationList({ searchArgs, search }) {
  const navigate = useNavigate();
  let [loading, setLoading] = useState(true);
  let [data, setData] = useState([]);
  let [rows, setRows] = useState([]);
  let [filteredRows, setFilteredRows] = useState([]);

  const getLastCure = (Prescriptions)=>{
    console.log(Prescriptions)
    if(!Prescriptions || Prescriptions.length == 0){
      return null;
    }
    let addr = '';
    console.log(Prescriptions)
    Prescriptions.forEach(pres=>{
      pres.Cures.forEach(cure=>{
        if(cure.state == "En Cours"){
          let cureN = parseInt(cure.name.split(' ')[1]) - 1
          addr = '/prescription/'+ pres.id + '?cure='+ cureN;
          return;
        }
      })
      if(addr != ''){
        return;
      }
    })
    return addr;
  }

  const presBtn = (e)=>{
    let addr = getLastCure(e.row.Prescriptions);
    console.log(addr)
    return (
      <Fab className="planning-btn" color="2663EE" aria-label="planning" onClick={()=>navigate(addr)}>
          <img src="/icons/list.svg" alt="+" />
      </Fab>
    )
  }

  const columns = [
    { field: "DMI", headerName: "DMI", flex:1 },
    { field: "nom", headerName: "Nom", flex:1 },
    { field: "prenom", headerName: "Prénom", flex:1 },
    { field: "birthDate", headerName: "Date Naissance", flex:1 },
    { field: "sexe", headerName: "Genre", flex:1 },
    { field: "prescription", headerName: "Prescription", align: 'left', flex:1, renderCell: presBtn },
  ];
  
  useEffect(()=>{
    axios.post(process.env.REACT_APP_SERVER_URL + '/getAllPatientsWithPres', {})
      .then(res => {
        setData(res.data);
        setRows(res.data);
        console.log(res.data)
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
        className='main-table'
        pageSizeOptions={[5, 10, 25, 50]}
        checkboxSelection
      /> : <CircularProgress /> }
    </div>
  );
}
