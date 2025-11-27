import { useGetUserByEmailMutation } from "../../store/apiSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import PasswordInput from "../password/PasswordInput.jsx";
import './login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const [loginUser, { isLoading }] = useGetUserByEmailMutation();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter both fields");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      const res = await loginUser(email).unwrap();  
      const user = res[0]; 

      if (user && user.password === password) {
        login(user.id);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("User not found");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1>Welcome to My Todo</h1>
        <p>
          Manage your tasks efficiently and stay organized with our intuitive todo application.
        </p>
      </div>

      <div className="login-right">
        <h2>Login</h2>
        <div className="login-box">
          <form onSubmit={(e) => {
            e.preventDefault(); 
            handleLogin();}}>
            <input className="input-field" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <PasswordInput value={password} onChange={setPassword} onEnter={handleLogin}/>
            {error && <p className="error-text">{error}</p>}
            <button className="gradient-btn" style={{width: '100%', marginTop: '1rem'}} onClick={handleLogin} disabled={isLoading}>Login</button>
            <button className="link-btn" type="button" onClick={() => navigate("/user-form")}>New User?</button>
          </form>
        </div>
      </div>
    </div>
  );
}
