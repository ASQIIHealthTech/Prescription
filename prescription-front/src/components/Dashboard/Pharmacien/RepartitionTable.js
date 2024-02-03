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

export default function RepartitionTable({ data, adaptedDose, flacons, setFractionDose }) {
  let [totalDose, setTotalDose] = React.useState(0);
  let [totalVolume, setTotalVolume] = React.useState(0);
  let [loading, setLoading] = React.useState(true);
  console.log(flacons)

  React.useEffect(() => {
    if(flacons.length > 0){
      if(adaptedDose >= flacons[0].dosage){
        let n = Math.floor(adaptedDose/flacons[0].dosage);
        flacons[0].quantity = n;
      }
    }
    setTimeout( ()=>{
      calculateTotal();
      setLoading(false);
    }, 200)
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
    setFractionDose(volume)

  }

  const changeNumber = (e, flac)=>{
    let value = e.target.value;
    flac.quantity = value;
    calculateTotal()
  }

  return (
    <TableContainer className='repartitionTable' component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell>Spécialité</TableCell>
            <TableCell align="right">Dosage</TableCell>
            <TableCell align="right">Volume unitaire</TableCell>
            <TableCell align="right">Quantité</TableCell>
            <TableCell align="right">Dose</TableCell>
            <TableCell align="right">Volume à prélever</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            !loading && flacons.map(flac=>(
              <TableRow key={0}>
                  <TableCell align="left">{flac.name}</TableCell>
                  <TableCell align="right">{flac.dosage} mg</TableCell>
                  <TableCell align="right">{flac.volume} ml</TableCell>
                  <TableCell align="right"><input disabled={data[2].liberer == 1} type='number' value={flac.quantity} onChange={(e)=>changeNumber(e, flac)} className='main-input' /></TableCell>
                  <TableCell align="right">{flac.dosage * flac.quantity} mg</TableCell>
                  <TableCell align="right">{flac.volume * flac.quantity} ml</TableCell>
              </TableRow>
            ))
          }
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell align="right">{ccyFormat(totalDose)} mg</TableCell>
            <TableCell align="right">{ccyFormat(totalVolume)} ml</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}