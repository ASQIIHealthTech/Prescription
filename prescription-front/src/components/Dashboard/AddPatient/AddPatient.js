import * as React from 'react';
import Box from '@mui/material/Box';
import AdminDetails from './AdminDetails';
import { useNavigate } from 'react-router-dom';


export default function AddPatient({ setAddingPatient }) {
  const navigate = useNavigate();

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    if(allStepsCompleted()){
      setAddingPatient(false)
    }else{
      handleNext();
    }
  };

  return (
    <div sx={{ width: '100%' }}>
      <div className='details-container'>
        <AdminDetails setAddingPatient={setAddingPatient} handleNext={handleComplete} />
      </div>
    </div>
  );
}