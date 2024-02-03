import axios from "axios";
import { useEffect, useState } from "react";

export default function ProtocoleParams({ searchArgs, protData, jNumber, setJNumber }){
    let [parentProtocoles, setParentProtocoles] = useState([]);

    useEffect(()=>{
        setParentProtocoles([]);
        axios.post(process.env.REACT_APP_SERVER_URL + '/getParentProtocoles')
            .then(res=>{
                setParentProtocoles(res.data)
            })
    }, [])


    const addProtArgs = (event)=>{
        let input = event.target;   
        let field = input.getAttribute('field');
        
        if(input.value){
            protData[field] = input.value;
        }else if(protData[field]){
            delete protData[field];
        }
        console.log(protData)
    }
    
    const changeIntercure = (val)=>{
        if(val){
            setJNumber(parseInt(val));
            protData['intercure'] = val;
        }else{
            setJNumber(0);
            protData['intercure'] = 0;
        }
    }
    
    return(
        <div className="search-block">
            <h1>Protocole</h1>
            <div className="filters">
                <div className="filter">
                    <label className="main-label">Label</label>
                    <input onChange={addProtArgs} field="protocole" type="text" className="main-input" />
                </div>
                <div className="filter">
                    <label className="main-label">Details</label>
                    <input onChange={addProtArgs} field="details" type="text" className="main-input" />
                </div>
                <div className="filter">
                    <label className="main-label">Indications</label>
                    <input onChange={addProtArgs} field="indications" type="text" className="main-input" />
                </div>
                <div className="filter">
                    <label className="main-label">Type Histologique</label>
                    <input onChange={addProtArgs} field="type_histo" type="text" className="main-input" />
                </div>
                <div className="filter">
                    <label className="main-label">Intercure</label>
                    <input onChange={(e)=>changeIntercure(e.target.value)} field="intercure" type="number" className="main-input" />
                </div>
                <div className="filter">
                    <label className="main-label">Nombre de cures</label>
                    <input onChange={addProtArgs} field="nb_cures" type="number" className="main-input" />
                </div>
                <div className="filter">
                    <label className="main-label">Protocole Parent:</label>
                    <select field="parent" className="main-input">
                        <option value=""></option>
                        {parentProtocoles.map(el=>(
                            <option value={el.parent}>{el.parent}</option>
                        ))}
                    </select>
                </div>
                <div className="filter">
                    <label className="main-label">Ordre</label>
                    <input defaultValue={1} onChange={addProtArgs} field="ordre" type="number" className="main-input" />
                </div>
            </div>
        </div>
        )
}