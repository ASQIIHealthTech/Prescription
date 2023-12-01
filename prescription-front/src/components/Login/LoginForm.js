import { useState, useRef, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Cookies from 'js-cookie';

const Alert = forwardRef(function Alert(props, ref) {
return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function LoginForm({ setLoggedIn }) {
    const navigate = useNavigate();
    
    const [open, setOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const usernameRef = useRef();
    const passwordRef = useRef();

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
          handleLogin();
        }
    };

    const handleLogin = () => {
        // setLoggedIn(true);  TBF FOR SELECT PAGE 
        let username = usernameRef.current.value;
        let password = passwordRef.current.value;
        
        axios.post(process.env.REACT_APP_SERVER_URL + '/login', { username, password }).then(res=>{
            if(res.status == 200 && res.data.user && res.data.token){
                Cookies.set("token", res.data.token, {
                    expires: 7,
                });
                navigate('/dashboard');
            }
        }).catch(error=>{
            setAlertText(error.response.data);
            setOpen(true);
        })

    };

    const handleAlertClose = ()=>{
        setOpen(false);
    }
    
    return(
        <div className="loginForm-container">
            <Snackbar open={open} autoHideDuration={6000} onClose={handleAlertClose} >
                <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>
                    {alertText}
                </Alert>
            </Snackbar>

            <div className="login-box">
                <h2>CONNEXION</h2>
                <div className="field user">
                    <label>Nom d'Utilisateur</label>
                    <input ref={usernameRef} className="main-input" type="text" />
                </div>
                <div className="field pass">
                    <label>Mot de Passe</label>
                    <input onKeyDown={(e)=>handleEnter(e)} ref={passwordRef} className="main-input" type="password" />
                </div>
                <button className="main-btn" onClick={()=>handleLogin()}>Confirmer</button>
            </div>
        </div>
        )
}