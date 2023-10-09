import { DataGrid } from "@mui/x-data-grid";
import Fab from '@mui/material/Fab';
import { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

export default function FeuVertList() {
  const navigate = useNavigate();
  let [loading, setLoading] = useState(true);
  let [data, setData] = useState([]);
  let [rows, setRows] = useState([]);
  let [filteredRows, setFilteredRows] = useState([]);

  const presBtn = (e)=>{
    return (
      <Fab className="planning-btn" color="2663EE" aria-label="planning" onClick={()=>navigate((e.row.Prescriptions.length > 0 ? ('/prescription/'+ e.row.Prescriptions[0].id) : null))}>
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
        pageSizeOptions={[5, 10, 25, 50]}
        checkboxSelection
      /> : <CircularProgress /> }
    </div>
  );
}
