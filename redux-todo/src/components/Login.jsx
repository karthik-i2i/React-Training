import { useGetUserByEmailMutation } from "../store/apiSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const [loginUser, { isLoading }] = useGetUserByEmailMutation();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter both fields");
      return;
    }

    try {
      const res = await loginUser(email).unwrap();  
      const user = res[0]; 

      if (user && user.password === password) {
        login(user);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("User not found");
    }
  };

  return (
    <div>
      <h1>My Todo</h1>
      <div className="login-input">
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="password-row">
          <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="button" className="show-toggle" disabled={!password} onClick={() => setShowPassword(prev => !prev)}>{showPassword ? "Hide" : "Show"}</button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="login-button">
          <button onClick={handleLogin} disabled={isLoading}>Login</button>
          <button onClick={() => navigate("/user-form")}>New User</button>
        </div>
      </div>
    </div>
  );
}
