import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';

export default function CureList({ molecules, patient }) {
  let [rows, setRows] = useState([])

  useEffect(()=>{
    setRows(molecules)
  }, [molecules])

  const getAdaptedDose = (row)=>{
    switch (row.unite){
      case 'mg/kg':
        return row.dose * patient.poids;
      case 'mg':
        return row.dose;
      case 'mg/m2':
        return row.dose * patient.surfCorp;
      case 'AUC':
        return row.dose * (patient.clairance + 25) ;
      default:
        return '-'
    }
  }

  return (
    <TableContainer sx={{ height: 240 }} component={Paper}>
      <Table aria-label="simple table">
        <TableHead className='cure-list-header'>
          <TableRow>
            <TableCell align="center">Jour</TableCell>
            <TableCell align="left">Produit</TableCell>
            <TableCell align="left">Unité</TableCell>
            <TableCell align="left">Dose Théorique</TableCell>
            <TableCell align="left">Dose Adaptée</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 && rows.map((row) => (
            <TableRow hover
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center" component="th" scope="row">
                J{row.jour_prod}
              </TableCell>
              <TableCell align="left">{row.molecule}</TableCell>
              <TableCell align="left">{row.unite}</TableCell>
              <TableCell align="left">{row.dose}</TableCell>
              <TableCell align="left">{getAdaptedDose(row)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}