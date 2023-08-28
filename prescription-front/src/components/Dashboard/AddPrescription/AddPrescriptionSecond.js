import { useEffect, useState } from 'react';
import axios from 'axios';
export default function AddPrescriptionSecond({ patient, prescriptionData, setPrescriptionData }){
    let [protocoles, setProtocoles] = useState({})

    useEffect(()=>{
        axios.post(process.env.REACT_APP_SERVER_URL + '/getAllProtocoles', {})
            .then((res)=>{
                setProtocoles(res.data);
            })
            .catch((err)=>{
                console.log(err)
            })
    }, [])

    const changeData = (e)=>{
        let field = e.target.attributes.name.nodeValue;
        let value = e.target.value;
        setPrescriptionData({
            ...prescriptionData,
            [field]: value
        })
    }

    return(
        <>
            <div className="prescription-second">
                <div className="row">
                    <label className="main-label">Organe : </label>
                    <select onChange={changeData} value={prescriptionData.organe} name="organe" id="organe" className="main-input">
                        <option value=""></option>
                        <option value="Poumon">Poumon</option>
                    </select>
                </div>
                <div className="row">
                    <label className="main-label">Indication : </label>
                    <select onChange={changeData} value={prescriptionData.indication} name="indication" id="indication" className="main-input">
                        <option value=""></option>
                        <option value="0">A petites cellules</option>
                    </select>
                </div>
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
                    <label className="main-label">Nbr Cures : </label>
                    <input onChange={changeData} value={prescriptionData.nbrCures} type="number" name="nbrCures" className="main-input" />
                </div>
            </div>
        </>
    )
}