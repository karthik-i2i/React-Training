import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUsersQuery, useUpdateUserMutation, useGetUserByIdQuery } from '../../store/apiSlice.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PasswordInput from '../password/PasswordInput.jsx';
import UserForm from '../user-form/UserForm.jsx';
import Popup from '../popup/Popup.jsx';
import UsersList from '../users-list/UsersList.jsx';
import Todo from '../todo/ToDo.jsx';
import './dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [updateUser] = useUpdateUserMutation();
  const { userId, logout } = useAuth();
  const { data: user, isLoading: userLoading } = useGetUserByIdQuery(userId, {skip: !userId});
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const [activeTab, setActiveTab] = useState('tasks');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  useEffect(() => {
    if (!userId) navigate("/");
  }, [userId]);

  useEffect(() => {
    const handleClick = (e) => {
      if(e.target instanceof Element) {
        if (!e.target.closest(".profile-dropdown-wrapper")) {
          setProfileDropdownOpen(false);
        }
      } 
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!userId) return null;

  if (userLoading || usersLoading) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const resetForm = () => {
    setTaskInput('');
    setIsEditTask(false);
    setEditIndex(null);
  }

  const handlePasswordUpdate = async () => {
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password must be identical");
      return;
    }

    if (currentPassword !== user.password) {
      setPasswordError("Incorrect current password");
      return;
    }

    if(currentPassword === newPassword) {
      setPasswordError("Current and new password cannot be same");
      return;
    }

    await updateUser({
      id: user.id,
      password: newPassword
    }).unwrap();

    setShowNotificationPopup(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError('');
    setShowPasswordPopup(false);
  };

  return (
    <div className='dashboard-body'>
      <div className='left-sidebar'>
        <div className={`sidebar-tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>Tasks</div>
        <div className={`sidebar-tab ${activeTab === 'users' ? 'active' : ''}`}  onClick={() => setActiveTab('users')}>Users</div>
      </div>
      <div className='dashboard-main'>
        <div className='dashboard-head'>
          <h2>Welcome, {user?.firstName}</h2>
          <div className="profile-dropdown-wrapper">
            <div className="profile-circle" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
              {user?.firstName?.charAt(0).toUpperCase()}
            </div>
            {profileDropdownOpen && (
              <div className="profile-dropdown" onMouseLeave={() => setProfileDropdownOpen(false)}>
                <div className="dropdown-item" onClick={() => {setActiveTab("profile"); setProfileDropdownOpen(!profileDropdownOpen);}}>
                  Profile
                </div>
                <div className="dropdown-item" onClick={() => {setShowPasswordPopup(true); setProfileDropdownOpen(!profileDropdownOpen)}}>
                  Change Password
                </div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='right-content'>
          {activeTab === 'tasks' && 
            <Todo users={users} />
          }
          {activeTab === "profile" && (
            <UserForm embedded={true} onCallBack={() => setActiveTab('tasks')} />
          )}
          {activeTab === "users" && (
            <UsersList users={users} />
          )}
        </div>
      </div>
      {showPasswordPopup && (
        <Popup firstButtonName={'Save'} firstButtonOnClick={handlePasswordUpdate} secondButtonName={'Cancel'} 
                  secondButtonOnClick={() => {setPasswordError(""); setShowPasswordPopup(false)}} error={passwordError} btnClassName={"gradient-btn-unfocus"}>
          <h2>Change Password</h2>
          <PasswordInput value={currentPassword} onChange={setCurrentPassword} placeholder="Current Password"/>
          <PasswordInput value={newPassword} onChange={setNewPassword} placeholder="New Password"/>
          <input type="password" placeholder="Confirm Password" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
        </Popup>
      )}
      {showNotificationPopup && (
        <Popup secondButtonName={"OK"} secondButtonOnClick={() => {setShowNotificationPopup(false); logout();}} message={"Password changed successfully!"}/>
      )}
    </div>
  );
}

