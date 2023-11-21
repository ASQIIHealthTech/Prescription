import axios from "axios";
import { useState, useEffect } from "react";
import PlanningProtocole from "./PlanningProtocole";
import ProtocoleParams from "./ProtocoleParams";

export default function AddProtocole(){
    let [jNumber, setJNumber] = useState(0);
    let [molecules, setMolecules]  = useState([]);
    let [protData, setProtData] = useState({
        protocole: '',
        id_protocole: 0,
        intercure: 0,
        nb_cures: 0,
        details: '',
        indications: '',
        type_histo: '',
    })
    let [rows, setRows] = useState([])

    useEffect(() => {
        axios.post(process.env.REACT_APP_SERVER_URL + '/getAllMolecules')
            .then(res=>{
                console.log(res.data)
                setMolecules(res.data)
            })
    }, [])

    const submitProtocole = ()=>{
        axios.post(process.env.REACT_APP_SERVER_URL + '/addProtocole', { protData, rows })
        .then(res=>{
            console.log(res)
            window.location.reload();
        })
    }

    return (
        <div className='addProtocole-container'>
            <ProtocoleParams protData={protData} jNumber={jNumber} setJNumber={setJNumber} />
            <PlanningProtocole rows={rows} setRows={setRows} molecules={molecules} jNumber={jNumber} setJNumber={setJNumber} submitProtocole={submitProtocole}  />
        </div>
    )
}