import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddUserMutation, useUpdateUserMutation } from "../store/apiSlice.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function UserForm() {
  const { user, updateUser: updateAuthUser } = useAuth();
  const navigate = useNavigate();
  const [addUser] = useAddUserMutation();
  const [updateUserApi] = useUpdateUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isPasswordChanged = formData.password !== user.password;

  useEffect(() => {
    if(user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // must include at least one special char
    const camelCaseRegex = /^(?=.*[a-z])(?=.*[A-Z])[A-Z][A-Za-z0-9!@#$%^&*(),.?":{}|<>]*$/;
    // explanation:
    // ^ - start of string
    // (?=.*[a-z]) - at least one lowercase letter
    // (?=.*[A-Z]) - at least one uppercase (and we also start with one)
    // [A-Z] - must start with uppercase
    // [A-Za-z0-9!@#$%^&*(),.?":{}|<>]* - rest can include letters, numbers, and specials

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format.";

    if( isPasswordChanged ) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      } else if (!specialCharRegex.test(formData.password)) {
        newErrors.password = "Password must include at least one special character.";
      } else if (!camelCaseRegex.test(formData.password)) {
        newErrors.password =
          "Password must start with a capital letter and contain at least one lowercase letter.";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (user) {
        await updateUserApi({
          id: user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          taskList: user.taskList || []
        }).unwrap();

        updateAuthUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        });

        alert("User updated successfully!");
        navigate('/dashboard');
      } else {
        await addUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          taskList: []
        }).unwrap();

        alert("User created successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Failed:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div>
      <h1>{user ? 'Update User' : 'Create User'}</h1>
      <form className="login-input" onSubmit={handleSubmit}>
        <input type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange}/>
        {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}
        <input type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange}/>
        {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}
        <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange}/>
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        <input type={showPassword ? 'text' : 'password'} placeholder="Password" name="password" value={formData.password} onChange={handleChange}/>
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        {isPasswordChanged && (<>
          <input type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword}</p>}</>)
        }

        <div className="login-button">
          <button>Save</button>
          <button type="button" onClick={() => {user ? navigate('/dashboard') : navigate("/")} }>Back</button>
          <button style={{width: '80px'}} type="button" disabled={!formData.password} onClick={() => setShowPassword(prev => !prev)}>{showPassword ? "Hide" : "Show"}</button>
        </div>
      </form>
    </div>
  );
}
