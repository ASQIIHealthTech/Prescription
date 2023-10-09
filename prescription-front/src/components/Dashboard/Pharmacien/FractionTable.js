import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function FractionTable({ data, adaptedDose}) {
  let [diff, setDiff] = React.useState(adaptedDose - Math.floor(adaptedDose/50)*50);

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
                {data[2].name} 50 mg 
                </TableCell>
                <TableCell align="right">50 mg</TableCell>
                <TableCell align="right">{( getAdjustedDose(adaptedDose) - Math.floor(adaptedDose/50)*50 ).toFixed(2)} mg</TableCell>
                <TableCell align="right">{diff} ml</TableCell>
                <TableCell align="right">{( getAdjustedDose(adaptedDose) - Math.floor(adaptedDose/50)*50 ).toFixed(2)} ml</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}