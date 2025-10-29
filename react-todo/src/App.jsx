import TodoProvider from "./TodoContext";
import TodoForm from "./TodoForm";
import TaskList from "./TaskList";
import "./App.css";

export default function App() {
  return (
    <div className="main-body">
      <div className="title">My To Do</div>
      <TodoProvider>
        <div className="todo-body">
          <TodoForm />
          <TaskList />
        </div>
      </TodoProvider>
    </div>
  );
}
