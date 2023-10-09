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

export default function RepartitionTable({ data, adaptedDose }) {
  let [number, setNumber] = React.useState(Math.floor(adaptedDose/50));
  console.log(data)

  const changeNumber = (e)=>{
    setNumber(e.target.value)
  }

  return (
    <TableContainer className='repartitionTable' component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell>Spécialité</TableCell>
            <TableCell align="right">Dosage</TableCell>
            <TableCell align="right">Quantité</TableCell>
            <TableCell align="right">Dose</TableCell>
            <TableCell align="right">Volume</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        <TableRow key={0}>
            <TableCell align="left">{data[2].name} 50 mg</TableCell>
            <TableCell align="right">50 mg</TableCell>
            <TableCell align="right"><input type='number' value={number} onChange={changeNumber} className='main-input' /></TableCell>
            <TableCell align="right">50 mg</TableCell>
            <TableCell align="right">5 ml</TableCell>
        </TableRow>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell align="right">{ccyFormat(50*number)} mg</TableCell>
            <TableCell align="right">{ccyFormat(5*number)} ml</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}