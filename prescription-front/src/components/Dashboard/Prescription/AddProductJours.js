import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const getDateDifference = (date1, date2) => {
  var date1 = new Date(date1);
  var date2 = new Date(date2);

  const time1 = date1.getTime();
  const time2 = date2.getTime();

  const differenceInMilliseconds = Math.abs(time2 - time1);
  const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

  return differenceInDays;
};

export default function AddProductJours({ data, jours, setJours, selectedCure }) {
  
  const changeDays = (j)=>{
    if(jours[j]){
      delete jours[j];
    }else{
      jours[j] = 1;
    }
  }
  
  console.log(data, jours)
  
  let firstDate;
  let usedJ= [];
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              data.Cures[selectedCure].Products.map((el, i)=>{
                firstDate = i==0 ? el.startDate : firstDate;
                usedJ = i==0 ? [] : usedJ;
                let j = getDateDifference(firstDate, el.startDate) + 1;
                if(usedJ.includes(j)){
                  return;
                }
                usedJ.push(j)
                return (
                  <TableCell align='center'>J{(i==0 ? 1 : j) }</TableCell>
                )
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            key={0}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
          {
            data.Cures[selectedCure].Products.map((el, i)=>{
              firstDate = i==0 ? el.startDate : firstDate;
              usedJ = i==0 ? [] : usedJ;
              let j = getDateDifference(firstDate, el.startDate) + 1;
              if(usedJ.includes(j)){
                return;
              }
              usedJ.push(j)
              return (
                <TableCell component="th" scope="row" align='center'>
                  <input onChange={(e)=>changeDays(j)} type='checkbox' className='main-checkbox' />
                </TableCell>
              )
            })
          }
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}