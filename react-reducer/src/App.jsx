import { useReducer, useState } from "react";

const initialTodos = [
  { id: 1, title: "Learn useReducer", done: false },
  { id: 2, title: "Practice React daily", done: false },
];

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, { id: Date.now(), title: action.payload, done: false }];

    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      );

    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload);

    default:
      return state;
  }
}

export default function App() {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);
  const [newTodo, setNewTodo] = useState("");

  const handleAdd = () => {
    if (newTodo.trim() === "") return;
    dispatch({ type: "ADD_TODO", payload: newTodo });
    setNewTodo("");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>ToDo</h2>

      <input
        className="todo-input"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter a new todo"
      />
      <button onClick={handleAdd}>Add</button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              margin: "8px 0",
              textDecoration: todo.done ? "line-through" : "none",
            }}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => dispatch({ type: "TOGGLE_TODO", payload: todo.id })}
            />
            {todo.title}
            <button
              onClick={() => dispatch({ type: "DELETE_TODO", payload: todo.id })}
              style={{ marginLeft: "10px", color: "red" }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
