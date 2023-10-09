import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import AjustementModal from "./AjustementModal";
import PocheModal from "./PocheModal";
import { useNavigate } from "react-router-dom";

export default function PharmacieACPList({  }) {
  const navigate = useNavigate();   
  let [rows, setRows] = useState([])
  let [changedRows, setChangedRows] = useState([])
  let [loading, setLoading] = useState(true)
  let [ajustement, setAjustement] = useState(0)
  let [poche, setPoche] = useState(0)

  function getDateDifference(date1Str, date2Str) {
    var start = moment(date2Str, "YYYY-MM-DD");
    var end = moment(date1Str, "YYYY-MM-DD");

    //Difference in number of days
    return moment.duration(start.diff(end)).asDays();
  }

  const openAjustement = (e)=>{
    setAjustement(e.row.id);
    e.row.adjusted = 1;
  }
  
  const openPoche = (e)=>{
    setPoche(e.row.id);
    e.row.poche = 1;
  }
  
  const ajustementBtn = (e)=>(
    <img className="gear-icon" src="/icons/gear.png" onClick={()=>openAjustement(e)} />
  )
  
  const flaskBtn = (e)=>(
    <img className="gear-icon" src="/icons/flask.png" onClick={()=>openPoche(e)} />
  )
  
  const fabBtn = (e)=>(
    <img className="gear-icon" src="/icons/clipboard.png" onClick={()=>navigate('/FAB?ids=' + e.row.id)} />
  )
  

  useEffect(() => {
    console.log(1)
    axios.post(process.env.REACT_APP_SERVER_URL+'/getAllCures', { medecin: true })
      .then(res=>{
        console.log(res)
        let data = res.data;
        setRows([])
        data.forEach(pres=>{
          pres.Cures.forEach(cure=>{
            cure.Products.forEach(prod=>{
              if(prod.validation != 2){
                return;
              }
              let obj = {
                id: prod.id,
                startDate: prod.startDate,
                name: prod.name,
                dose: prod.dose + ' ' + prod.Molecule.unite,
                patient: pres.Patient.nom + ' ' + pres.Patient.prenom,
                protocole: (pres.Protocole != undefined ? pres.Protocole.protocole : null),
                validation: prod.validation,
                adjusted: 0,
                poche: 0
              }
              setRows(prev=>[ ...prev, obj])
            })
          })

        } )
        setLoading(false)
      })
      .catch(err=>{
        console.log(err)
      })
    // Prompt confirmation when reload page is triggered
    window.onbeforeunload = () => { return "" };
        
    // Unmount the window.onbeforeunload event
    return () => { window.onbeforeunload = null };
  }, []);

  const getAdaptedDose = (unite, row)=>{
    let val = 0;
    console.log(row)
    switch (unite){
      case 'mg/kg':
        return parseInt(row.dose * patient.poids).toFixed(2);
      case 'mg':
        return parseInt(row.dose).toFixed(2);
      case 'mg/m²':
        return parseInt(row.dose * patient.surfCorp).toFixed(2);
      case 'AUC':
        return parseInt(row.dose * (patient.clairance + 25)).toFixed(2) ;
      default:
        return '-';
    }
  }

  const columns = [
    { field: "startDate", headerName: "Date", flex:3 },
    { field: "name", headerName: "Produit", flex:3 },
    { field: "dose", headerName: "Dose Prs", flex:3 },
    { field: "patient", headerName: "Patient", flex:3 },
    { field: "protocole", headerName: "Protocole", flex:3 },
    { field: "flask", headerName: "Véhicule", flex:1, renderCell: flaskBtn },
    { field: "ajustement", headerName: "Ajustement", flex:1, renderCell: ajustementBtn },
    { field: "ss", headerName: "Fiche", flex:1, renderCell: fabBtn },
  ];

  const handleChange = (ids)=>{
    console.log(ids)
  }

  if(!loading){
    return (
      <>
        {ajustement != 0 ? <AjustementModal ajustement={ajustement} setAjustement={setAjustement} /> : null}
        {poche != 0 ? <PocheModal poche={poche} setPoche={setPoche} /> : null}
        <DataGrid
          rows={rows} 
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(ids)=>{
            console.log(55)
          }}
        />
      </>
  ); }
}