import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import moment from 'moment';

export default function ProductsList({ rows, setRows, products, cure, patient, validateAll, setValidateAll }) {
  let [currentDay, setCurrentDay] = useState('')
  let [dates, setDates] = useState([])

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
        console.log('diff', diff)
        groupedData[diff] = [];
      }
      groupedData[diff].push(prod)
    }
    
    console.log(groupedData)
    setRows(groupedData)
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

  const getAdaptedDose = (row)=>{
    let val = 0;
    switch (row.unite){
      case 'mg/kg':
        return parseInt(row.dose * patient.poids).toFixed(2);
      case 'mg':
        return parseInt(row.dose).toFixed(2);
      case 'mg/m2':
        return parseInt(row.dose * patient.surfCorp).toFixed(2);
      case 'AUC':
        return parseInt(row.dose * (patient.clairance + 25)).toFixed(2) ;
      default:
        return '-';
    }
  }

  const Jcell = ({row})=>{
    // if(!dates[row.startDate]){
    //   dates[row.startDate] = 1;
    //   console.log(1)
    // }else{
    //   console.log(2)
    //   return '';
    // }
    
    return (
        <TableCell rowSpan={1} style={{width: '50px'}}>
          1
        </TableCell>
      )
  }

  const toggleValidate = (changedRow, event, jourIndex)=>{
    const updatedData = rows.map((jour, index) => {
      if (index === jourIndex) {
        const updatedJour = jour.map((row) =>
          row === changedRow ? { ...row, validation: changedRow.validation == 0 ? 1 : 0 } : row
        );
        return updatedJour;
      }
      return jour;
    });
    
    setRows(updatedData);
  }

  const changeAdaptedDose = (changedRow, event, jourIndex)=>{
    const updatedData = rows.map((jour, index) => {
      if (index === jourIndex) {
        const updatedJour = jour.map((row) =>
          row === changedRow ? { ...row, dose: event.target.value } : row
        );
        return updatedJour;
      }
      return jour;
    });
    
    setRows(updatedData);
    console.log(updatedData)
  }

  const getPercentage = (row)=>{
    return (parseInt(row.dose) * 100)/parseInt(getAdaptedDose(row.Molecule))
  }

  const changePercentage = (e, row, jourIndex)=>{
    // let percentage = e.target.value;
    // let doseTheo = row.Molecule.dose;

    // let event = []
    // event['target'] = [];
    // row.dose = (percentage * doseTheo)/100
    // event.target.value = row.dose;
    // console.log(row.dose)
    // changeAdaptedDose(row, event, jourIndex)
  }

  return (
    <TableContainer id="toExportPDF" sx={{ height: 350 }} component={Paper}>
      <Table aria-label="simple table">
        <TableHead className='cure-list-header'>
          <TableRow>
            <TableCell align="left"></TableCell>
            <TableCell align="left">Jour</TableCell>
            <TableCell align="left">Produit</TableCell>
            <TableCell align="left">Formule (dose - Unité)</TableCell>
            <TableCell align="left">Dosage théorique</TableCell>
            <TableCell align="left">Dose adaptée</TableCell>
            <TableCell align="left">Dose %</TableCell>
            <TableCell align="left">Validation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 && rows.map((jour, index) => (
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
                  <TableCell align="left">{row.startDate}</TableCell>
                  <TableCell align="left">{row.Molecule.molecule}</TableCell>
                  <TableCell align="left">{row.Molecule.dose + ' ' + row.Molecule.unite}</TableCell>
                  <TableCell align="left">{getAdaptedDose(row.Molecule) + ' ' + row.Molecule.unite}</TableCell>
                  <TableCell align="left"><input type='number' onChange={(e)=>changeAdaptedDose(row, e, index)} value={row.dose} className='main-input' /></TableCell>
                  <TableCell align="left"><div className='percentage-input-container'><input onChange={(e)=>changePercentage(e, row, index)} type='number' value={getPercentage(row).toFixed(2)} className='main-input' /></div></TableCell>
                  <TableCell align="left">
                    <div onClick={(e)=>toggleValidate(row, e, index)} className={( row.validation == 1 ? 'validationCircle valid-medecin' : 'validationCircle') }></div>
                  </TableCell>
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}