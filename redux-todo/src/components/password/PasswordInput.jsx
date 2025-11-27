import { useState } from "react";
import EyeIcon from "../../assets/eye.svg";
import EyeOffIcon from "../../assets/eye-off.svg";
import "./password-input.css";

export default function PasswordInput({value, onChange, placeholder = "Password", onEnter, className = ""}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className={`password-row fancy ${className}`}>
      <input type={showPassword ? "text" : "password"} className="password-input input-field" placeholder={placeholder} 
        value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={handleKeyDown}/>
      <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
        <img src={showPassword ? EyeOffIcon : EyeIcon} alt="toggle password visibility" className="icon-img"/>
      </span>
    </div>
  );
}
