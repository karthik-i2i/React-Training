import {useSelector, useDispatch} from 'react-redux'
import {addTask, deleteTask, editTask, toggleComplete} from './store/todoSlice.js'
import { useState } from 'react';

export default function Todo() {
    const taskList = useSelector((state) => state.todo.taskList);
    const [task, setTask] = useState('');
    const [isEditTask, setIsEditTask] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const dispatch = useDispatch();

    const handleAddTask = () => {
        if(task.trim() && !isEditTask) {
            dispatch(addTask(task));
            setTask('');
        } else if (isEditTask) {
            dispatch(editTask({editIndex, task}));
            setIsEditTask(false);
            setEditIndex(null);
            setTask('');
        }
    }

    const handleEditTask = (index) => {
        setIsEditTask(true);
        setEditIndex(index);
        setTask(taskList[index].taskName);
    }

    const handleToggleComplete = (index) => {
        dispatch(toggleComplete(index));
        setIsEditTask(false);
        setEditIndex(null);
        setTask('');
    }

    const handleDeleteTask = (index) => {
        dispatch(deleteTask(index));
        setIsEditTask(false);
        setEditIndex(null);
        setTask('');
    }

    return (
        <div className='todoBody'>
            <h1>Todo List</h1>
            <form onSubmit={(e) => { 
                e.preventDefault(); 
                handleAddTask();
            }}>
            <input className='taskInput' type="text" value={task} onChange={(e) => setTask(e.target.value)}/>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', columnGap: '1rem' }}>
                <button type="submit" style={{marginLeft: '20px'}}> {isEditTask ? 'Save' : 'Add Task'} </button>
                {isEditTask && (<button type="button" onClick={() => { setIsEditTask(false); setTask(''); }}> Cancel </button>)}
            </div>
            </form>
            <div className='todoList'>
                {taskList.map((task, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
    );
}


