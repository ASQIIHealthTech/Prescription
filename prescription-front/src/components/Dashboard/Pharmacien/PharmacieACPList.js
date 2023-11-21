import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import AjustementModal from "./AjustementModal";
import { useNavigate } from "react-router-dom";

export default function PharmacieACPList({ search, searchArgs }) {
  const navigate = useNavigate();   
  let [rows, setRows] = useState([])
  let [loading, setLoading] = useState(true)
  let [ajustement, setAjustement] = useState(0)
  let [filteredRows, setFilteredRows] = useState([]);
  let [constData, setConstData] = useState([]);

  function getDateDifference(date1Str, date2Str) {
    var start = moment(date2Str, "YYYY-MM-DD");
    var end = moment(date1Str, "YYYY-MM-DD");

    //Difference in number of days
    return moment.duration(start.diff(end)).asDays();
  }

  const openAjustement = (e)=>{
    setAjustement(e.row.id);
  }
  
  const ajustementBtn = (e)=>{
    if(e.row.adjusted == 1){
      return (<img className="gear-icon" src="/icons/gear-active.png" onClick={()=>openAjustement(e)} />)
    }else{
      return (<img className="gear-icon" src="/icons/gear.png" onClick={()=>openAjustement(e)} />)
    }
  }
  
  const fabBtn = (e)=>{
    if(e.row.adjusted == 1){
      return (<img className="gear-icon" src="/icons/clipboard-active.png" onClick={()=>navigate('/FAB?ids=' + e.row.id)} /> )
    }else{
      return (<img className="gear-icon" src="/icons/clipboard.png" /> )
    }
  }
  

  useEffect(() => {
    console.log(1)
    axios.post(process.env.REACT_APP_SERVER_URL+'/getAllCures', { medecin: true })
      .then(res=>{
        console.log(res)
        let data = res.data;
        setRows([])
        setConstData([])
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
                adjusted: prod.adjusted
              }
              setConstData(prev=>[ ...prev, obj])
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

  useEffect(()=>{
    filterRows();
  }, [search])

  function filterRows(){
    console.log(rows)
    if(Object.keys(searchArgs).length == 0){
      setRows(constData)
      return;
    }

    let searchKeys = Object.keys(searchArgs);
    filteredRows = []
    let valid = true;
    let done = false;

    constData.forEach(el=>{
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

  const columns = [
    { field: "startDate", headerName: "Date", flex:3 },
    { field: "name", headerName: "Produit", flex:3 },
    { field: "dose", headerName: "Dose Prs", flex:3 },
    { field: "patient", headerName: "Patient", flex:3 },
    { field: "protocole", headerName: "Protocole", flex:3 },
    { field: "ajustement", headerName: "Ajustement", flex:1, renderCell: ajustementBtn },
    { field: "ss", headerName: "Fiche", flex:1, renderCell: fabBtn },
  ];

  if(!loading){
    return (
      <>
        {ajustement != 0 ? <AjustementModal ajustement={ajustement} setAjustement={setAjustement} rows={rows} /> : null}
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
          className="main-table"
          disableRowSelectionOnClick
          onRowSelectionModelChange={(ids)=>{
            console.log(55)
          }}
        />
      </>
  ); }
}