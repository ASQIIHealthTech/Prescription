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

export default function FABTable({ data, adaptedDose }) {
  let [number, setNumber] = React.useState(Math.floor(adaptedDose/50));

  const changeNumber = (e)=>{
    setNumber(e.target.value)
  }

  const getAdjustedDose = (num)=>{
    const val = Math.round(num / 0.2) * 0.2;
    return val.toFixed(2);
  }

  return (
    <TableContainer className='repartitionTable' component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell>Spécialité</TableCell>
            <TableCell align="right">Dosage</TableCell>
            <TableCell align="right">Quantité</TableCell>
            <TableCell align="right">Volume/Unité (ml)</TableCell>
            <TableCell align="right">Volume Total (ml)</TableCell>
            <TableCell align="right">Masse Totale (mg)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        <TableRow key={0}>
            <TableCell align="left">{data.name} 50 mg</TableCell>
            <TableCell align="right">50 mg</TableCell>
            <TableCell align="right">{number}</TableCell>
            <TableCell align="right">5 ml</TableCell>
            <TableCell align="right">{5*number} ml</TableCell>
            <TableCell align="right">{50*number} mg</TableCell>
        </TableRow>
        <TableRow key={1}>
            <TableCell align="left">{data.name} 50 mg</TableCell>
            <TableCell align="right">50 mg</TableCell>
            <TableCell align="right">1/n</TableCell>
            <TableCell align="right">5 ml</TableCell>
            <TableCell align="right">{( getAdjustedDose(adaptedDose) - Math.floor(adaptedDose/50)*50 ).toFixed(2)} ml</TableCell>
            <TableCell align="right">{( getAdjustedDose(adaptedDose) - Math.floor(adaptedDose/50)*50 ).toFixed(2)} mg</TableCell>
        </TableRow>
          <TableRow>
            <TableCell colSpan={3}></TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">{ parseFloat(5*number) + parseFloat( (getAdjustedDose(adaptedDose) - Math.floor(adaptedDose/50)*50 ).toFixed(2) ) } ml</TableCell>
            <TableCell align="right">{ parseFloat(50*number) + parseFloat( (getAdjustedDose(adaptedDose) - Math.floor(adaptedDose/50)*50 ).toFixed(2) )} mg</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}