import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateUserTasksMutation } from '../store/apiSlice.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const [updateUserTasks] = useUpdateUserTasksMutation();
  const {user, logout, updateUser} = useAuth();
  const [taskList, setTaskList] = useState(user?.taskList || []);
  const [taskInput, setTaskInput] = useState("");
  const [isEditTask, setIsEditTask] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  if (!user) return null;

  const handleSaveTask = async () => {
    if (!taskInput.trim()) return;
    let updatedTasks;
    if(!isEditTask) {
      updatedTasks = [...taskList, { taskName: taskInput, isCompleted: false }];
    } else {
      updatedTasks = [...taskList];      
    }
    setTaskList(updatedTasks);
    resetForm();
    await updateUserTasks({ id: user.id, taskList: updatedTasks }).unwrap();
    updateUser({ taskList: updatedTasks });
  };

  const handleEditTask = async (index) => {
    setIsEditTask(true);
    setTaskInput(taskList[index].taskName);
    setEditIndex(index);
  };

  const handleDeleteTask = async (index) => {
    const updatedTasks = taskList.filter((_, i) => i !== index);
    setTaskList(updatedTasks);
    resetForm();
    await updateUserTasks({ id: user.id, taskList: updatedTasks }).unwrap();
    updateUser({ taskList: updatedTasks });
  };

  const handleToggleComplete = async (index) => {
    const updatedTasks = [...taskList];
    updatedTasks[index].isCompleted = !updatedTasks[index].isCompleted;
    setTaskList(updatedTasks);
    resetForm();
    await updateUserTasks({ id: user.id, taskList: updatedTasks }).unwrap();
    updateUser({ taskList: updatedTasks });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const resetForm = () => {
    setTaskInput('');
    setIsEditTask(false);
    setEditIndex(null);
  }

  return (
    <div>
      <div className='dashboard-head'>
        <h2>Welcome, {user?.firstName}</h2>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
          <button onClick={() => navigate('/user-form')}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className='todoBody'>
          <h2>Todo List</h2>
          <form onSubmit={(e) => { 
              e.preventDefault(); 
              handleSaveTask();
          }}>
          <div className='task-input-container'>
            <input className='taskInput' type="text" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} placeholder='Add new task'/>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', columnGap: '1rem' }}>
                <button type="submit" style={{marginLeft: '20px'}} disabled={!taskInput}> {isEditTask ? 'Save' : 'Add Task'} </button>
                {isEditTask && (<button type="button" onClick={() => { setIsEditTask(false); setTaskInput(''); }}> Cancel </button>)}
            </div>
          </div>
          </form>
          <div className='todoList'>
              {taskList.map((task, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px' }}>
                      <p style={{marginLeft: '20px', textDecoration: task.isCompleted ? 'line-through' : 'none'}}>
                          {task.taskName}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', columnGap: '1rem' }}> 
                          <button onClick={() => handleToggleComplete(index)}>{task.isCompleted ? 'Undo' : 'Complete'}</button>
                          <button disabled={task.isCompleted} onClick={() => handleEditTask(index)}>Edit</button>
                          <button onClick={() => handleDeleteTask(index)}>Delete</button>  
                      </div>             
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
