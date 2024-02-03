import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState, useRef } from 'react';
import moment from 'moment';

export default function ProductsList({ user, rows, setRows, products, cure, patient, validateAll, setValidateAll, fiche }) {
  let [loading, setLoading] = useState(false);

  function getDateDifference(date1Str, date2Str) {
    var start = moment(date2Str, "YYYY-MM-DD");
    var end = moment(date1Str, "YYYY-MM-DD");

    //Difference in number of days
    return moment.duration(start.diff(end)).asDays();
  }

  useEffect(()=>{
    let groupedData = [];
    let firstDate = cure.startDate;

    for(const prod of products){
      let diff = getDateDifference(firstDate, prod.startDate) + 1;
      if(!groupedData[diff]){
        groupedData[diff] = [];
      }
      groupedData[diff].push(prod)
    }
    
    setRows(groupedData)
    console.log(1, products, groupedData)
  }, [products])

  useEffect(() => {
    if(validateAll && rows){
      const updatedData = rows.map((jour, index) => {
          const updatedJour = jour.map((row) =>{
            return { ...row, validation: 1 };
          });
          return updatedJour;
      });
      setRows(updatedData);
      setValidateAll(false)
    }
  }, [validateAll])

  const getAdaptedDose = (unite, dose, row)=>{
    let val = 0;
    switch (unite){
      case 'mg/kg':
        return parseFloat(dose * patient.poids).toFixed(2);
      case 'mg':
        return parseFloat(dose).toFixed(2);
      case 'mg/m²':
        let val = parseFloat(dose * patient.surfCorp).toFixed(2);
        if(row && row.Molecule.molecule == "Vincristine" && val > 2){
          return 2;
        }
        return val;
      case 'AUC':
        return parseFloat(dose * (patient.clairance + 25)).toFixed(2) ;
      default:
        return '-';
    }
  }

  const toggleValidate = (changedRow, event, jourIndex)=>{
    if(cure.state == 'Prévu'){
      return;
    }
    let value = 0;
    if(user.type == "medecin"){
      value = changedRow.validation == 0 ? 1 : 0;
    }else if(user.type == "pharmacien"){
      if(changedRow.validation == 1){
        value = 2;
      }else if (changedRow.validation == 2){
        value = 1;
      }
    }else{
      return;
    }


    const updatedData = rows.map((jour, index) => {
      if (index === jourIndex) {
        const updatedJour = jour.map((row) =>
          row === changedRow ? { ...row, validation: value } : row
        );
        return updatedJour;
      }
      return jour;
    });
    
    setRows(updatedData);
  }

  const changeDose = (changedRow, value, jourIndex, j)=>{
    const updatedData = rows.map((jour, index) => {
      if (index === jourIndex) {
        const updatedJour = jour.map((row) =>
          row === changedRow ? { ...row, dose: value } : row
        );
        return updatedJour;
      }
      return jour;
    });
    document.getElementById("prod-adaptedDose-"+jourIndex+'-'+j).value = getAdaptedDose(changedRow.Molecule.unite, value, changedRow);
    console.log(value, changedRow.Molecule.dose, getPercentage(value, changedRow.Molecule.dose));
    document.getElementById("prod-percentage-"+jourIndex+'-'+j).value = getPercentage(value, changedRow.Molecule.dose);
    setRows(updatedData);
  }

  const getPercentage = (dose, molDose)=>{
    return parseFloat((parseInt(dose) * 100)/parseInt(molDose).toFixed(2)).toFixed(2).toString()
  }

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const changeDate = (type, changedRow, jourIndex, i)=>{
    let daysToAdd = type === 0 ? -1 : 1;
    if(jourIndex + daysToAdd < 1){
      return;
    }
    var new_date = moment(addDays(changedRow.startDate, daysToAdd)).format('YYYY-MM-DD');

    const updatedData = rows.map((jour, index) => {
      if (index === jourIndex) {
        const updatedJour = jour.map((row) =>
          row === changedRow ? { ...row, startDate: new_date } : { ...row } // Create a new copy of the row
        );
        return updatedJour;
      }
      return jour;
    });

    changedRow.startDate = new_date;
    updatedData[jourIndex].splice(i, 1);
    if(updatedData[jourIndex + daysToAdd]){
      updatedData[jourIndex + daysToAdd].push(changedRow)
    }else{
      updatedData[jourIndex + daysToAdd] = [changedRow]
    }
    setRows(updatedData);
  }

  const changePercentage = (e, row, i, j)=>{
    const value = e.target.value;
    const orig = row.Molecule.dose;

    const per = (value * 100)/orig;
    const newDose = (orig*per)/100
    changeDose(row, newDose, i, j);

  }

  const changeHeureAdmin = (changedRow, value, jourIndex, j)=>{
    console.log(11)
    const updatedData = rows.map((jour, index) => {
      if (index === jourIndex) {
        const updatedJour = jour.map((row) =>
          row === changedRow ? { ...row, heureAdmin: value } : row
        );
        return updatedJour;
      }
      return jour;
    });
    setRows(updatedData);
  }

  return (
    <TableContainer className='productsList' id="toExportPDF" sx={{ height: 350 }} component={Paper}>
      <Table aria-label="simple table">
        <TableHead className='cure-list-header'>
          <TableRow>
            <TableCell align="left"></TableCell>
            <TableCell align="left">Jour</TableCell>
            <TableCell align="left">Produit</TableCell>
            <TableCell align="left">Formule (dose - Unité)</TableCell>
            <TableCell align="left">Dosage théorique</TableCell>
            <TableCell align="left">Dose</TableCell>
            <TableCell align="left">Dose adaptée</TableCell>
            <TableCell align="left">Dose %</TableCell>
            <TableCell align="left">Validation</TableCell>
            <TableCell align="left">durée du perfusion</TableCell>
            <TableCell align="left">Heure d'administration</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading && rows.length > 0 && rows.map((jour, index) => (
            <>
              {jour.length > 0 && jour.map((row, j) => (
                <TableRow hover
                  className={j==0 ? 'first-jour-row' : null}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {j==0 && (
                    <>
                      <TableCell className='j-column' rowSpan={jour.length}>
                        J{index}
                      </TableCell>
                    </>
                  )}
                  <TableCell align="left"><label className={'date-controls prevent-selection' + (index == 1 ? ' date-controls-disabled' : '')} onClick={(e)=>changeDate(0, row, index, j)}>-</label> {row.startDate} <label className='date-controls prevent-selection' onClick={(e)=>changeDate(1, row, index, j)}>+</label></TableCell>
                  <TableCell align="left">{row.Molecule.molecule}</TableCell>
                  <TableCell align="left">{row.Molecule.dose + ' ' + row.Molecule.unite}</TableCell>
                  <TableCell align="left">{getAdaptedDose(row.Molecule.unite, row.Molecule.dose, row) } mg</TableCell>
                  <TableCell align="left"><input id={"prod-dose-"+index+'-'+j} type='number' disabled={row.validation != 0} onChange={(e)=>changeDose(row, e.target.value, index, j)} value={row.dose} className='main-input' /></TableCell>
                  <TableCell align="left"><input id={"prod-adaptedDose-"+index+'-'+j} type='number' disabled  value={getAdaptedDose(row.Molecule.unite, row.dose, row)} className='main-input' /></TableCell>
                  <TableCell align="left"><div className='percentage-input-container'><input id={"prod-percentage-"+index+'-'+j} disabled onBlur={(e)=>changePercentage(e, row, index, j)} type='number' value={getPercentage(row.dose, row.Molecule.dose)} className='main-input' /></div></TableCell>
                  <TableCell align="left">
                    <div onClick={(e)=>toggleValidate(row, e, index)} className={'validationCircle' + ( row.validation == 1 ? ' valid-medecin' : '') + ( row.validation == 2 ? ' valid-pharmacien' : '') }></div>
                  </TableCell>
                  <TableCell align="left"><input type="number" className="main-input" /></TableCell>
                  <TableCell align="left"><input type="time" className="main-input" disabled={row.validation != 0} value={row.heureAdmin || "10:00"} onChange={(e)=>changeHeureAdmin(row, e.target.value, index, j)} /></TableCell>
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}