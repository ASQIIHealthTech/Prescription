import { useEffect, useState } from 'react';
import AddPrescriptionFirst from "./AddPrescriptionFirst";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import AddPrescriptionSecond from './AddPrescriptionSecond';
import AddPrescriptionThird from './AddPrescriptionThird';
import AddPrescriptionFourth from './AddPrescriptionFourth';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const steps = ['1', '2', '3'];

export default function AddPrescription({ setAddPrescription, addPrescription }) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [patient, setPatient] = useState({});
  let [prescriptionData, setPrescriptionData] = useState({
    prescripteur: '',
    date: moment().format('YYYY-MM-DD'),
    organe: '',
    indication: '',
    protocole: '',
    nbrCures: 1
  });

  

  useEffect(()=>{
    if(addPrescription){
      axios.post(process.env.REACT_APP_SERVER_URL + '/getPatientById', { id: addPrescription })
        .then((res) => {
          setPatient(res.data)
          console.log(res.data)
        })
        .catch((err)=>{
          console.log(err)
        })
    }
  }, [addPrescription])

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    if(activeStep == 0){
      setAddPrescription(null)
    }else{
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    if(isLastStep()){
      let patientId = patient.id;
      axios.post(process.env.REACT_APP_SERVER_URL + '/addPrescription', { patientId , data: prescriptionData })
        .then((res)=>{
          if(res.status == 200){
            navigate('/planning/' + patient.id)
          }
        })
        .catch(error =>{
          console.log(error)
        })
    }else{
      const newCompleted = completed;
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      handleNext();
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-box">
        <h1>NOUVELLE PRESCRIPTION</h1>
        <Stepper className='stepper' nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                
                </StepButton>
            </Step>
            ))}
        </Stepper>
        { Object.keys(patient).length== 0 && <CircularProgress /> }
        { activeStep == 0 && Object.keys(patient).length != 0 && <AddPrescriptionFirst patient={patient} prescriptionData={prescriptionData} setPrescriptionData={setPrescriptionData} /> }
        { activeStep == 1 && Object.keys(patient).length != 0 && <AddPrescriptionSecond patient={patient} prescriptionData={prescriptionData} setPrescriptionData={setPrescriptionData} /> }
        { activeStep == 2 && Object.keys(patient).length != 0 && <AddPrescriptionFourth patient={patient} prescriptionData={prescriptionData} setPrescriptionData={setPrescriptionData} /> }
        {/* { activeStep == 3 && Object.keys(patient).length != 0 && <AddPrescriptionFourth patient={patient} prescriptionData={prescriptionData} setPrescriptionData={setPrescriptionData} /> } */}
        <div className="btn-container">
          <button className="main-btn" onClick={()=>handleBack()}>{ activeStep == 0 ? 'Annuler' : 'Précèdent'}</button>
          <button className="main-btn" onClick={()=>handleComplete()}>{ isLastStep() ? 'Confirmer' : 'Suivant'}</button>
        </div>
      </div>
    </div>
  );
}
