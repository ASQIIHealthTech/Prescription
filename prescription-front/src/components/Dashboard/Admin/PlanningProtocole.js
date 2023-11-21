import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add';
import MoleculeModal from './MoleculeModal';
import { Autocomplete, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function createData(name = '', calories, fat, carbs, protein, price) {
  return {
    name,
    unite: 'mg/kg',
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}

function Row(props) {
  const { N, setLoading, row, jNumber, setJNumber, setMoleculeModal, molecules, rows, setRows } = props;
  const [open, setOpen] = React.useState(false);

  console.log(rows)

  const changeData = (e, i)=>{
    let checked = e.target.checked;
    row['j'+(i+1)] = (checked == true ? 1 : 0);
  }
  
  const changeDataDose = (e, i)=>{
    let value = e.target.value;
    setRows((prevArray) => {
      const newArray = [...prevArray];
      newArray[N]['dose'] = parseInt(value);
      return newArray;
    });
  }
  
  const changeDataName = (e)=>{
    let value = (e.target.value != '' ? e.target.value : e.target.innerText);
    setLoading(true)
    setRows((prevArray) => {
      const newArray = [...prevArray];
      newArray[N]['name'] = value;
      return newArray;
    });
    setTimeout(()=>{
      setLoading(false)
    }, 200)
  }
  
  const changeDataUnite = (e)=>{
    let value = e.target.value;
    setRows((prevArray) => {
      const newArray = [...prevArray];
      newArray[N]['unite'] = value;
      return newArray;
    });
  }

  const deleteRow = (row)=>{
    setRows((prevArray) => {
      const newArray = [...prevArray];
      const updatedData = newArray.filter((item, i) => i != N);
      return updatedData;
    });
    console.log(rows)
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <IconButton
            size="small"
            onClick={() => deleteRow(row)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Autocomplete
            freeSolo
            options={molecules.map((option) => option.molecule)}
            renderInput={(params) => <TextField {...params} />}
            onBlur={(e)=>changeDataName(e)}
            defaultValue={row.name}
            className='medicamentInput'
          />
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          <input defaultValue={row.dose} onChange={(e)=>changeDataDose(e)} type='number' className='main-input planning-small-input' />
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          <select defaultValue={row.unite} className='main-input' onChange={(e)=>changeDataUnite(e)} >
            <option value="mg/kg">mg/kg</option>
            <option value="mg">mg</option>
            <option value="mg/m²">mg/m²</option>
            <option value="AUC">AUC</option>
          </select>
        </TableCell>
        {Array(jNumber).fill(1).map((el, i) => (
            <TableCell align="center"><input defaultChecked={row['j'+(i+1)]} onChange={(e)=>changeData(e, i)} type='checkbox' className='main-checkbox planning-small-input' /></TableCell>
        ))}
        <TableCell align="center"><img className='protocole-icon' src='/icons/gear.png' onClick={()=>setMoleculeModal(row)} /></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        0000
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function LastRow({ rows, setRows }) {

    const addMed = ()=>{
      setTimeout(() => {
        setRows(prev=>[...prev, createData('')])
      }, 50);
    }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={()=>addMed()}>
            <AddIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function PlanningProtocole({ jNumber, setJNumber, molecules, rows, setRows, submitProtocole }) {
  let [moleculeModal, setMoleculeModal] = React.useState({});
  let [loading, setLoading] = React.useState(false);

  const addDays = ()=>{
    setJNumber(prev=>prev+7);
  }

  return (
    <>
      { Object.keys(moleculeModal).length > 0 ? <MoleculeModal moleculeModal={moleculeModal} setMoleculeModal={setMoleculeModal} /> : null }
      <div className='protocole-planning'>
          <h1>Planning</h1>
          <TableContainer className='planning-table' component={Paper}>
              <Table aria-label="collapsible table">
                  <TableHead>
                  <TableRow>
                      <TableCell />
                      <TableCell>Medicament</TableCell>
                      <TableCell align="center">Dose</TableCell>
                      <TableCell align="center">Unité</TableCell>
                      {Array(jNumber).fill(1).map((row, i) => (
                          <TableCell align='center'>J{i+1}</TableCell>
                      ))}
                      <TableCell />
                  </TableRow>
                  </TableHead>
                  <TableBody>
                  {!loading && rows.map((row, i) => (
                      <Row N={i} setLoading={setLoading} setRows={setRows} jNumber={jNumber} key={row.name} row={row} rows={rows} setMoleculeModal={setMoleculeModal} molecules={molecules} />
                  ))}
                  <LastRow rows={rows} setRows={setRows} />
                  </TableBody>
              </Table>
          </TableContainer>
          <button className='main-btn add-btn' onClick={(e)=>submitProtocole()}>Ajouter</button>
      </div>
    </>
  );
}