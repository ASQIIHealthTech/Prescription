import { useNavigate } from 'react-router-dom'

export default function Header(){
    const navigate = useNavigate();


    return(
        <div className="header">
            <img onClick={()=>navigate('/')} src="/asqii-A.png" alt="LOGO" />
            <div className="user-box">
                <label>Dr Mghirbi</label>
                <img src="/icons/profilecircle.png" alt="user" />
            </div>
        </div>
        )
}