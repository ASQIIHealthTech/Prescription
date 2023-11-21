import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function PharmacieProductsList({ search, searchArgs }) {
  const navigate = useNavigate();
  let [currentDay, setCurrentDay] = useState('')
  let [rows, setRows] = useState([])
  let [constData, setConstData] = useState([])
  let [filteredRows, setFilteredRows] = useState([])
  let [loading, setLoading] = useState(true)
  let [dates, setDates] = useState([])

  function getDateDifference(date1Str, date2Str) {
    var start = moment(date2Str, "YYYY-MM-DD");
    var end = moment(date1Str, "YYYY-MM-DD");

    //Difference in number of days
    return moment.duration(start.diff(end)).asDays();
  }

  const validationBtn = (e)=>(
    <div className={('validationCircle' + ( e.row.validation == 1 ? ' valid-medecin' : '') + ( e.row.validation == 2 ? ' valid-pharmacien' : '') ) }></div>
  )
  const prescriptionBtn = (e)=>(
    <img onClick={()=>navigate('/prescription/' + e.row.presId)} src='/icons/list.png' className="pres-icon" />
  )

  useEffect(() => {
    axios.post(process.env.REACT_APP_SERVER_URL+'/getAllCures', { medecin: false })
      .then(res=>{
        let data = res.data;
        setRows([])
        setConstData([])
        data.forEach(pres=>{
          pres.Cures.forEach(cure=>{
            cure.Products.forEach(prod=>{
              let obj = {
                id: prod.id,
                presId: pres.id,
                startDate: prod.startDate,
                name: prod.name,
                dose: prod.dose + ' ' + prod.Molecule.unite,
                patient: pres.Patient.nom + ' ' + pres.Patient.prenom,
                protocole: (pres.Protocole != undefined ? pres.Protocole.protocole : null),
                validation: prod.validation
              }
              setRows(prev=>[ ...prev, obj])
              setConstData(prev=>[ ...prev, obj])
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
    { field: "startDate", headerName: "Date", flex:2 },
    { field: "name", headerName: "Produit", flex:2 },
    { field: "dose", headerName: "Dose Prs", flex:1 },
    { field: "patient", headerName: "Patient", flex:3 },
    { field: "protocole", headerName: "Protocole", flex:3 },
    { field: "validation", headerName: "", flex:1, renderCell: validationBtn },
    { field: "prescription", headerName: "", flex:1, renderCell: prescriptionBtn },
  ];

  if(!loading){
    return (
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
        className='main-table'
      />
  ); }
}