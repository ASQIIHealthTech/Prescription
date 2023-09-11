import * as React from 'react';
import Box from '@mui/material/Box';
import AdminDetails from './AdminDetails';
import { useNavigate } from 'react-router-dom';
import { AddPatientOLD } from './AddPatient OLD';

export default function AddPatient({ setAddingPatient }) {
  const navigate = useNavigate();

  const handleComplete = () => {
    const newCompleted = AddPatientOLD.completed;
    newCompleted[AddPatientOLD.activeStep] = true;
    AddPatientOLD.setCompleted(newCompleted);
    if(AddPatientOLD.allStepsCompleted()){
      setAddingPatient(false)
    }else{
      AddPatientOLD.handleNext();
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