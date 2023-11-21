import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';

export default function Header({ user }){
    const navigate = useNavigate();

    const logout = ()=>{
        Cookies.remove('token');
        navigate('/');
    }

    return(
        <div className="header">
            <img onClick={()=>navigate('/')} src="/asqii-A.png" alt="LOGO" />
            <div className="user-box">
                <div className='name-box'>
                    <label className="userName">{user.name}</label>
                    <label className="userType">{user.type}</label>
                </div>
                <img onClick={(e)=>logout()} src="/icons/profilecircle.png" alt="user" />
            </div>
        </div>
        )
}