import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddUserMutation, useUpdateUserMutation, useGetUserByIdQuery } from "../../store/apiSlice.js";
import { useAuth } from "../../context/AuthContext.jsx";
import PasswordInput from "../password/PasswordInput.jsx";
import Popup from "../popup/Popup.jsx";
import './user-form.css';


export default function UserForm({embedded, onCallBack}) {
  const { userId } = useAuth();
  const { data: userData, isLoading: userLoading } = useGetUserByIdQuery(userId, { skip: !userId });
  const isEditMode = !!userId;
  const navigate = useNavigate();
  const [addUser] = useAddUserMutation();
  const [updateUserApi] = useUpdateUserMutation();
  const [popup, setPopup] = useState({ visible: false, message: "" });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    gender: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (isEditMode && userLoading) return <div className="loader-wrapper"><div className="loader" /></div>;
  
  useEffect(() => {
    if(userData && isEditMode) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        dob: userData.dob || '',
        gender: userData.gender || '',
        phoneNumber: userData.phoneNumber || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [userData, isEditMode]);

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
    if(!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else {
      if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format.";
    }
    if (!formData.dob) newErrors.dob = "Date of Birth is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required."; 
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
    } 

    if(!isEditMode) {
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
      if (isEditMode) {
        await updateUserApi({
          id: userData.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dob: formData.dob,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber
        }).unwrap();

        if (embedded) {
          setPopup({ visible: true, message: "Profile updated!" });
        } else {
          setPopup({ visible: true, message: "User updated successfully!" });
          navigate('/dashboard');
        }
      } else {
        await addUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          dob: formData.dob,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
          password: formData.password
        }).unwrap();

        setPopup({ visible: true, message: "User created successfully!" });
        navigate("/");
      }
    } catch (error) {
      console.error("Failed:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="user-form-body">
      {!userData && <h1>Create User</h1>}
      <form className="user-form-input" autoComplete="off" onSubmit={handleSubmit}>
        <div className="user-form-row">
          <div className="user-form-left-row">
            <input className="input-field" type="text" placeholder="* First Name" name="firstName" value={formData.firstName} onChange={handleChange}/>
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            <input className="input-field" type="text" placeholder="Last Name (Optional)" name="lastName" value={formData.lastName} onChange={handleChange}/>
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            <input className="input-field" disabled={isEditMode} type="email" placeholder="* Email" name="email" value={formData.email} onChange={handleChange}/>
            {errors.email && <span className="error-text">{errors.email}</span>}
            {!isEditMode && (
              <>
                <PasswordInput value={formData.password} onChange={(val) => setFormData({ ...formData, password: val })} placeholder="* Password"/>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </>
            )}
          </div>
          <div className="user-form-right-row">
            <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
              <option value="">* Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <span className="error-text">{errors.gender}</span>}
            <input className="input-field" type="tel" placeholder="* Phone Number" name="phoneNumber" value={formData.phoneNumber}   
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); 
                if (value.length <= 10) {
                  setFormData({ ...formData, phoneNumber: value });
                }
              }} maxLength={10}/>
            {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
            <input className="input-field" type="date" placeholder="Date of Birth" name="dob" value={formData.dob} onChange={handleChange}/>
            {errors.dob && <span className="error-text">{errors.dob}</span>}
            {(!userData) && (<>
              <input className="input-field" type="password" placeholder="* Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}</>)
            }
          </div>
        </div>
        <div className="user-form-buttons">
          <button className="gradient-btn" type="submit">Save</button>
          <button className="gradient-btn gradient-btn-unfocus" type="button" onClick={() =>  onCallBack ? onCallBack() : navigate("/")}>Back</button>
        </div>
      </form>
      {popup.visible && (
        <Popup message={popup.message} firstButtonName={'OK'}
          firstButtonOnClick={() => {
            if(embedded) {
              setPopup({visible: false, message: ''});
              onCallBack?.();
            }
            else navigate('/');
          }
        }/>
      )}
    </div>
  );
}
