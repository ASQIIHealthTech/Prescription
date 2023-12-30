import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

export default function FractionTable({ data, adaptedDose, flacons }) {
  let [totalDose, setTotalDose] = React.useState(0);
  let [totalVolume, setTotalVolume] = React.useState(0);
  let [loading, setLoading] = React.useState(true);
  let [fractionDose, setFractionDose] = React.useState(0);
  console.log(fractionDose)
  
  React.useEffect(() => {
    calculateTotal();
    if(flacons.length > 0){
      setTimeout( ()=>{
        setLoading(false);
        calculateTotal();
      }, 200)
    }
  }, [flacons])

  const calculateTotal = ()=>{
    let dose = 0;
    let volume = 0;

    flacons.forEach((flac, i)=>{
      dose += flac.dosage * flac.quantity; 
      volume += flac.volume * flac.quantity; 
    })
    setTotalDose(dose)
    setTotalVolume(volume)
    setFractionDose( (getAdjustedDose(adaptedDose) - dose) );
    if(flacons.length > 0 && (getAdjustedDose(adaptedDose) - dose) > 0){
      flacons[0].fracQuantity = 1;
      flacons[0].fraction = ( ( (getAdjustedDose(adaptedDose) - dose) * 100) / flacons[0].dosage ) / 100;
      console.log(flacons[0].fraction)
    }
  }

  const changeNumber = (e, flac, i)=>{
    let value = e.target.value
    flac.fracQuantity = parseInt(value)
    calculateTotal()
  }

  const getAdjustedDose = (num)=>{
    const val = Math.round(num * 2) / 2;
    return val.toFixed(2);
  }

  if(!loading){
    return (
      <TableContainer className='repartitionTable' component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell>Spécialité</TableCell>
              <TableCell align="right">Dosage</TableCell>
              <TableCell align="right">Quantité</TableCell>
              <TableCell align="right">Dose</TableCell>
              <TableCell align="right">Volume unitaire</TableCell>
              <TableCell align="right">Volume prélever</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              !loading && flacons.map((flac, i)=>(
                <TableRow key={i}>
                    <TableCell align="left">{flac.name}</TableCell>
                    <TableCell align="right">{flac.dosage} mg</TableCell>
                    <TableCell align="right"><input disabled={true} type='number' value={ (fractionDose > 0 && i==0) ? 1 : (flac.fracQuantity)} onChange={(e)=>changeNumber(e, flac, i)} className='main-input' /></TableCell>
                    <TableCell align="right">{flac.dosage} mg</TableCell>
                    <TableCell align="right">{flac.volume} ml</TableCell>
                    <TableCell align="right">{flac.volume * flac.fracQuantity} ml</TableCell>
                </TableRow>
              ))
            }
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell align="right">{( fractionDose ).toFixed(2)} mg</TableCell>
              <TableCell colSpan={1}></TableCell>
              <TableCell align="right">{( (flacons[0].volume * fractionDose) / flacons[0].dosage  ).toFixed(2)} ml</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}