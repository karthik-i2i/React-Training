import { useState, useContext, useEffect } from "react";
import { TodoContext } from "./TodoContext";

export default function TodoForm() {
  const { dispatch, editTask } = useContext(TodoContext);
  const [taskText, setTaskText] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("");
  const [important, setImportant] = useState(false);
  const [type, setType] = useState("");
  const [editId, setEditId] = useState(null);

  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    setMinDate(today);
  }, []);

  useEffect(() => {
    if (editTask) {
      setTaskText(editTask.text);
      setDate(editTask.date);
      setTime(editTask.time);
      setPriority(editTask.priority);
      setImportant(editTask.important);
      setType(editTask.type);
      setEditId(editTask.id);
    }
  }, [editTask]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!taskText || !date || !time || !priority || !type) return;

    const task = {
      id: editId || Date.now(),
      text: taskText,
      date,
      time,
      priority,
      important,
      type,
      completed: false,
    };

    dispatch({
      type: editId ? "EDIT_TASK" : "ADD_TASK",
      payload: task,
    });

    setTaskText("");
    setDate("");
    setTime("");
    setPriority("");
    setImportant(false);
    setType("");
    setEditId(null);
  }

  function handleCancel() {
    setTaskText("");
    setDate("");
    setTime("");
    setPriority("");
    setImportant(false);
    setType("");
    setEditId(null);
    dispatch({ type: "SET_EDIT_TASK", payload: null });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="todo-inputs">
        <div className="task-section">
          <div className="section-title">Add a Task</div>
          <div className="input-group">
            <input type="text" placeholder="Enter your task" className="task-input" value={taskText} onChange={(e) => setTaskText(e.target.value)} required/>
            <input type="date" className="date-input" value={date} min={minDate} onChange={(e) => setDate(e.target.value)} required/>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}/>
          </div>
          <div className="save-cancel-btn">
            <button type="submit" id="addTaskBtn">
              {editId ? "Save" : "Add Task"}
            </button>
            {editId && (<button type="button" id="cancelBtn" onClick={handleCancel}>Cancel</button>)}
          </div>

        </div>
        <div className="settings-section">
          <div className="section-title">Task Settings</div>
          <div className="input-group">
            <input type="number" placeholder="Priority (1-5)" min="1" max="5" value={priority} onChange={(e) => setPriority(e.target.value)} required/>
            <div className="options-group">
              <label>
                <input type="checkbox" checked={important} onChange={(e) => setImportant(e.target.checked)}/>{" "} 
                Mark as Important
              </label>
              <label>
                <input type="radio" name="taskType" value="Personal" checked={type === "Personal"} onChange={(e) => setType(e.target.value)} required/>{" "}
                Personal
              </label>
              <label>
                <input type="radio" name="taskType" value="Work" checked={type === "Work"} onChange={(e) => setType(e.target.value)} required />{" "}
                Work
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
