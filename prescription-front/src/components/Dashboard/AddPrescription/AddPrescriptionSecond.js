import { useEffect, useState } from 'react';
import axios from 'axios';
export default function AddPrescriptionSecond({ patient, prescriptionData, setPrescriptionData }){
    let [protocoles, setProtocoles] = useState({})
    let [parentProtocoles, setParentProtocoles] = useState({})

    useEffect(()=>{
        console.log(patient)
        let groupedProtsOne = [];
        let groupedProts = [];
        axios.post(process.env.REACT_APP_SERVER_URL + '/getAllProtocoles', {})
            .then((res)=>{
                setProtocoles(res.data);
                for(let prot of res.data){
                    if(prot?.parent && !groupedProts.includes(prot.parent)){
                        if(groupedProtsOne.includes(prot.parent)){
                            groupedProts.push(prot.parent);
                        }else{
                            groupedProtsOne.push(prot.parent);
                        }
                    }
                }
                setParentProtocoles(groupedProts)
                console.log(groupedProts)
            })
            .catch((err)=>{
                console.log(err)
            })

        // axios.post(process.env.REACT_APP_SERVER_URL + '/getParentProtocoles', {})
        //     .then((res)=>{
        //         setParentProtocoles(res.data);
        //     })
        //     .catch((err)=>{
        //         console.log(err)
        //     })
    }, [])

    const getProtocoleNbrCures = (id)=>{
        
        axios.post(process.env.REACT_APP_SERVER_URL+'/getProtocole', {id})
            .then(res=>{
                const data = res.data;
                setPrescriptionData({
                    ...prescriptionData,
                    'protocole': data?.id,
                    'nbrCures': data?.nb_cures
                })
            })

    }

    const changeData = (e)=>{
        let field = e.target.attributes.name.nodeValue;
        let value = e.target.value;

        if(field == 'protocole'){

            prescriptionData.parent = '';
            setPrescriptionData({
                ...prescriptionData,
                protocole: value
            })
                
            getProtocoleNbrCures(value);

            return;
        }

        if(field == "parent"){
            prescriptionData.protocole = '';
            setPrescriptionData({
                ...prescriptionData,
                parent: value
            })
            return;
        }
        
        if(field == 'essaiClin'){
            value = (e.target.checked ? 1 : 0);
        }
        
        setPrescriptionData({
            ...prescriptionData,
            [field]: value
        })
        console.log(prescriptionData);
    }

    const getLastPres = ()=>{
        axios.post(process.env.REACT_APP_SERVER_URL + '/getLatestPrescription', { patientId: patient.id })
            .then((res)=>{
                let data = res.data;
                if(data){
                    setPrescriptionData({
                        ...prescriptionData,
                        ['essaiClin']: (data.essaiClin == true ? 1 : 0),
                        ['protocole']: data.id_protocole,
                        ['nbrCures']: data.nbrCures,
                    })
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    return(
        <>
            <div className="prescription-second">
                {/* <div className="row">
                    <label className="main-label">Primitif : </label>
                    <select onChange={changeData} value={prescriptionData.organe} name="organe" id="organe" className="main-input">
                        <option value=""></option>
                        <option value="Poumon">Poumon</option>
                    </select>
                </div>
                <div className="row">
                    <label className="main-label">Type Histologique : </label>
                    <select onChange={changeData} value={prescriptionData.indication} name="indication" id="indication" className="main-input">
                        <option value=""></option>
                        <option value="0">A petites cellules</option>
                    </select>
                </div>
                <div className="row">
                    <label className="main-label">Protocole Parent : </label>
                    <select onChange={changeData} value={prescriptionData.parent} name="parent" id="Protocole" className="main-input">
                        <option value=""></option>
                        { parentProtocoles.length > 0 && parentProtocoles.map(el=>{
                            if(el){
                                return (
                                    <option value={el}>{el}</option>
                                )
                            } 
                        })}
                    </select>
                </div> */}
                <div className="row">
                    <label className="main-label">Protocole : </label>
                    <select onChange={changeData} value={prescriptionData.protocole} name="protocole" id="Protocole" className="main-input">
                        <option value=""></option>
                            { Object.keys(protocoles).length > 0 && protocoles.map(el=>(
                                <option value={el.id_protocole}>{el.protocole}</option>
                            ))}
                    </select>
                </div>
                <div className="row">
                    <label className="main-label">Nombre de Cures : </label>
                    <input onChange={changeData} value={prescriptionData.nbrCures} type="number" name="nbrCures" className="main-input" />
                </div>
                <div className="essai-row">
                    <input onChange={changeData} checked={prescriptionData.essaiClin == 1} type="checkbox" name="essaiClin" className="main-checkbox" />
                    <label className="main-label">Essai Clinique</label>
                    <button className='main-btn' onClick={()=>getLastPres()}>Reprendre la dernière prescription</button>
                </div>
            </div>
        </>
    )
}