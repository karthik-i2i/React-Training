import { useContext } from "react";
import { TodoContext } from "./TodoContext";

export default function TaskList() {
  const { tasks, dispatch } = useContext(TodoContext);

  function handleComplete(id) {
    dispatch({ type: "COMPLETE_TASK", payload: id });
  }

  function handleEdit(task) {
    dispatch({ type: "SET_EDIT_TASK", payload: task });
  }

  return (
    <div id="taskList">
      {tasks.length === 0 && <p>No tasks yet...</p>}
      {tasks.map((task) => (
        <div className="task-item" key={task.id}>
          <span
            className="task-text"
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed ? "#777" : "#000",
            }}
          >
            {task.text} ({task.date}{" "}
            {new Date(`1970-01-01T${task.time}`).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}) [Priority: {task.priority}]{" "}
            {task.important ? "Important" : ""} [{task.type}]
          </span>
          <div className="task-buttons">
            <button className="edit-btn" onClick={() => handleEdit(task)} disabled={task.completed}>
              Edit
            </button>
            <button className="complete-btn" disabled={task.completed} onClick={() => handleComplete(task.id)}>
              Complete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
