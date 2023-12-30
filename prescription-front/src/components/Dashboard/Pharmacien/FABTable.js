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

export default function FABTable({ data, adaptedDose, prepMolecule, flacons, totalVolume, setTotalVolume }) {
  let [number, setNumber] = React.useState(Math.floor(adaptedDose/50));
  let [totalDose, setTotalDose] = React.useState(0);
  let [loading, setLoading] = React.useState(true);
  let [lowestFlac, setLowestFlac] = React.useState({});

  const changeNumber = (e)=>{
    setNumber(e.target.value)
  }

  React.useEffect(() => {
    if(flacons){

      let dose = 0;
      let volume = 0;
      
      let lowFlac = flacons[0];
      flacons.forEach((flac, i)=>{
        dose += flac.dosage * flac.quantity; 
        volume += flac.volume * flac.quantity; 
        if(lowFlac.dosage > flac.dosage){
          lowFlac = flacons[i];
        }
      })
      setLowestFlac(lowFlac);
      setTotalDose(( (parseFloat(totalDose) + parseFloat( (getAdjustedDose(adaptedDose) - totalDose ) )) / 10 ).toFixed(2))
      setTotalVolume(( (parseFloat(totalDose) + parseFloat( (getAdjustedDose(adaptedDose) - totalDose ) )) / 10 ).toFixed(2))
  
      setLoading(false);
    
    }
  }, [flacons])
  
  const calculateTotal = ()=>{
    let dose = 0;
    let volume = 0;
    
    flacons.forEach((flac, i)=>{
      dose += flac.dosage * flac.quantity; 
      volume += flac.volume * flac.quantity; 
    })
    setTotalDose(dose + (getAdjustedDose(adaptedDose) - totalDose).toFixed(2) )
    setTotalVolume(volume)
  }
  

  const getAdjustedDose = (num)=>{
    const val = Math.round(num *2) /2;
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
            <TableCell align="right">Solvant de Reconstitution</TableCell>
            <TableCell align="right">Volume de Reconstitution</TableCell>
            <TableCell align="right">N° Lot</TableCell>
            <TableCell align="right">Volume/Unité (ml)</TableCell>
            <TableCell align="right">Volume Total (ml)</TableCell>
            <TableCell align="right">Masse Totale (mg)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            !loading && flacons.map((flac, i)=>{
              if(flac.quantity == 0){
                return;
              }
              return(
              <TableRow key={i}>
                  <TableCell align="left">{flac.name}</TableCell>
                  <TableCell align="right">{flac.dosage} mg</TableCell>
                  <TableCell align="right">{flac.quantity}</TableCell>
                  <TableCell align="right">{prepMolecule.solvant_reconstitution}</TableCell>
                  <TableCell align="right">{(prepMolecule.pretA == "prêt à l'emploi") ? "prêt à l'emploi" : (prepMolecule.volume_reconstitution ? prepMolecule.volume_reconstitution + ' ml' : null)}</TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right">{flac.volume} ml</TableCell>
                  <TableCell align="right">{(flac.volume) * flac.quantity} ml</TableCell>
                  <TableCell align="right">{flac.dosage * flac.quantity} mg</TableCell>
              </TableRow>

            )})
          }
        { !loading && flacons.length > 0 && flacons[0].fracQuantity > 0 && (<TableRow key={1}>
            <TableCell align="left">{lowestFlac.name}</TableCell>
            <TableCell align="right">{lowestFlac.dosage} mg</TableCell>
            <TableCell align="right">1/n</TableCell>
            <TableCell align="right">{prepMolecule.solvant_reconstitution}</TableCell>
            <TableCell align="right">{prepMolecule.pretA == "prêt à l'emploi" ? "prêt à l'emploi" : (prepMolecule.volume_reconstitution ? prepMolecule.volume_reconstitution + ' ml' : null)}</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right">{lowestFlac.volume} ml</TableCell>
            <TableCell align="right">{( (getAdjustedDose(adaptedDose) - totalDose)/10 ).toFixed(2)} ml</TableCell>
            <TableCell align="right">{( getAdjustedDose(adaptedDose) - totalDose ).toFixed(2)} mg</TableCell>
        </TableRow>)}
          <TableRow>
            <TableCell colSpan={6}></TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">{ ((parseFloat(totalDose) + parseFloat( getAdjustedDose(adaptedDose) - totalDose )) / 10).toFixed(2) } ml</TableCell>
            <TableCell align="right">{ (parseFloat(totalDose) + parseFloat( getAdjustedDose(adaptedDose) - totalDose )).toFixed(2) } mg</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}