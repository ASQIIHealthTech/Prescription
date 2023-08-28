import { useEffect, useRef, useState  } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './dashboard.scss'
import Header from './Header'
import PatientsBody from './Patients/PatientsBody'
import Cookies from 'js-cookie';
import Planning from './Planning/Planning'

export function Dashboard({ path }){
    const navigate = useNavigate()

    let { patientId } = useParams();

    useEffect(()=>{
        let token = Cookies.get('token');
        if(token){

        }else{
            navigate('/')
        }      
    }, [])

    return(
        <div className="dashboard-container">
            <Header />
            <div className="dashbaord-body">
                {path == 'patients' && <PatientsBody />}
                {path == 'planning' && <Planning patientId={patientId} /> }
            </div>
        </div>
    )
}