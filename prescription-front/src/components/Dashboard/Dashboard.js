import { useEffect, useRef, useState  } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './dashboard.scss'
import Header from './Header'
import PatientsBody from './Patients/PatientsBody'
import Cookies from 'js-cookie';
import Planning from './Planning/Planning'
import Prescription from './Prescription/Prescription'
import axios from 'axios'
import PharmacienBody from './Pharmacien/PharmacienBody'
import AddProtocole from './Admin/AddProtocole';
import Fiche from './Prescription/Fiche'

export function Dashboard({ path }){
    const navigate = useNavigate()
    let [user, setUser] = useState({})

    let { patientId, presId } = useParams();

    useEffect(()=>{
        let token = Cookies.get('token');
        if(token){
            axios.post(process.env.REACT_APP_SERVER_URL + '/checkToken', { token })
                .then((res)=>{
                    setUser(res.data.tokenUser)
                })
                .catch((err)=>{
                    navigate('/')
                })
        }else{
            navigate('/')
        }      
    }, [])

    const getComponent = ()=>{
        if(user.type == 'medecin'){
            switch(path){
                case 'patients':
                    return (<PatientsBody user={user} />);
                case 'planning':
                    return (<Planning patientId={patientId} />);
                case 'prescription':
                    return (<Prescription user={user} presId={presId} />);
                case 'fiche':
                    return (<Fiche user={user} presId={presId} />);
                case 'addProtocole':
                    return (<AddProtocole />);
                default:
                    return (<PatientsBody />);
            }
        }else if(user.type == 'pharmacien'){
            switch(path){
                case 'patients':
                    return (<PharmacienBody />);
                case 'prescription':
                    return (<Prescription user={user} presId={presId} />);
                case 'planning':
                    return (<Planning patientId={patientId} />);
            }
        }
    }

    return(
        <div className="dashboard-container">
            <Header user={user} />
            <div className="dashbaord-body">
                {getComponent()}
            </div>
        </div>
    )
}