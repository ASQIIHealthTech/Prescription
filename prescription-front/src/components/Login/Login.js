import { useState } from 'react'
import Header from "./Header";
import LoginForm from "./LoginForm";
import SelectForm from "./SelectForm";
import "./login.scss";

export function Login() {
  let [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="login-container">
      <Header />
      {!loggedIn ? <LoginForm setLoggedIn={setLoggedIn} /> : <SelectForm /> }
    </div>
  );
}
