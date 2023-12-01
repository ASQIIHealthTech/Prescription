import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function FractionTable({ data, adaptedDose, flacons, setFlacons }) {
  let [lowestFlac, setLowestFlac] = React.useState({});
  let [totalDose, setTotalDose] = React.useState(0);
  let [totalVolume, setTotalVolume] = React.useState(0);
  let [diff, setDiff] = React.useState(adaptedDose - totalDose);

  React.useEffect(() => {
    let dose = 0;
    let volume = 0;
    
    let lowFlac = flacons[0];
    flacons.forEach((flac, i)=>{
      dose += flac.dosage * flac.quantity; 
      volume += (flac.dosage / 10) * flac.quantity; 
      if(lowFlac.dosage > flac.dosage){
        lowFlac = flacons[i];
      }
      setLowestFlac(flac);
    })
    setTotalDose(dose)
    setTotalVolume(volume)

    console.log(adaptedDose, dose)
    setDiff((adaptedDose - dose).toFixed(2));
  }, [flacons])

  const getAdjustedDose = (num)=>{
    const val = Math.round(num / 0.2) * 0.2;
    return val.toFixed(2);
  }

  return (
    <TableContainer className='fractionTable' component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Spécialité</TableCell>
            <TableCell align="right">Dosage</TableCell>
            <TableCell align="right">Dose</TableCell>
            <TableCell align="right">Volume</TableCell>
            <TableCell align="right">Volume Corrigé</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow
                key={0}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell component="th" scope="row">
                {lowestFlac.name} 
                </TableCell>
                <TableCell align="right">{lowestFlac.dosage}  mg</TableCell>
                <TableCell align="right">{( getAdjustedDose(adaptedDose) - totalDose ).toFixed(2)} mg</TableCell>
                <TableCell align="right">{(diff/10).toFixed(2)} ml</TableCell>
                <TableCell align="right">{( (getAdjustedDose(adaptedDose) - totalDose)/10 ).toFixed(2)} ml</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}