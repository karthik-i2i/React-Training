import { useState, useEffect, useRef } from "react";
import { useAddTaskMutation, useGetTasksQuery, useUpdateTaskMutation, useDeleteTaskMutation } from "../../store/apiSlice.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Popup from "../popup/Popup.jsx";
import SaveTask from "./SaveTask.jsx";
import "./todo.css";
import ListLayout from "../list-layout/ListLayout.jsx";
import Card from "../card/Card.jsx";

export default function Todo({ users }) {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "Todo",
    assigneeId: null,
    assignedBy: "",
    assigneeSearch: ""
  });
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);
  const [showEditTaskPopup, setShowEditTaskPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTask, setSearchTask] = useState('');
  const pageSize = 2;
  const wrapperRef = useRef();
  const { userId } = useAuth();
  const [addTask] = useAddTaskMutation();
  const { data: allTasks = [], isLoading: tasksLoading } = useGetTasksQuery();
  const userTasks = userId ? allTasks.filter(t => t?.assigneeId == userId) : [];
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const filteredUsers = !taskData.assigneeSearch.trim() ? users : users.filter(u => u.email.toLowerCase().includes(taskData.assigneeSearch.toLowerCase()));

  const filteredTasks = userTasks?.filter((task) => {
    const s = searchTask.toLowerCase();
    return task?.title.toLowerCase().includes(s);
  });

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const paginatedTasks = filteredTasks.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTask]);

  if (!users || tasksLoading) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    );
  }

  const updateTaskData = (key, value) => {
    setTaskData(prev => ({ ...prev, [key]: value }));
  };

  const resetTaskData = () => {
    setTaskData({
      title: "",
      description: "",
      status: "Todo",
      assigneeId: null,
      assignedBy: "",
      assigneeSearch: ""
    });
    setSelectedTask(null);
    setIsDropdownOpen(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateTask({ id, status: newStatus });
    setShowStatusDropdown(null);
  };

  const handleSave = async () => {
    if (!taskData.title || !taskData.assigneeId) return;
    await addTask({ ...taskData, assignedBy: userId });
    setShowAddTaskPopup(false);
    resetTaskData();
  };

  const handleUpdate = async () => {
    if (!selectedTask) return;
    await updateTask({ id: selectedTask.id, ...taskData });
    setShowEditTaskPopup(false);
    resetTaskData();
  };

  const handleDelete = async () => {
    if (!selectedTask || !selectedTask.id) {
      console.warn("Delete attempted without a valid task");
      return;
    }
    await deleteTask(selectedTask.id);
    setSelectedTask(null);
    setShowDeletePopup(false);
  };

  const handleEditClick = (task) => {
    if (!users) return;
    setSelectedTask(task);
    setTaskData({
      title: task.title,
      description: task.description,
      status: task.status,
      assigneeId: task.assigneeId,
      assigneeSearch: users.find(u => u.id == task.assigneeId)?.email || "",
      assignedBy: userId
    });
    setShowEditTaskPopup(true);
  };

  return (
    <>
      <ListLayout headerRight={<button className="gradient-btn" onClick={() => setShowAddTaskPopup(true)}>Add Task</button>}
        searchValue={searchTask} onSearchChange={setSearchTask} page={page} totalPages={totalPages}
        onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))}
        searchPlaceholder="Search task">
        {filteredTasks.length === 0 ? (
          <p className="no-tasks">No tasks yet</p>
        ) : (
          paginatedTasks.map((task) => (
            <Card
              key={task.id}
              type="task"
              data={task}
              users={users}
              onEdit={handleEditClick}
              onStatus={setShowStatusDropdown}
              onDelete={(task) => { setSelectedTask(task); setShowDeletePopup(true); }}
              showStatusDropdown={showStatusDropdown}
              setShowStatusDropdown={setShowStatusDropdown}
              onStatusChange={handleStatusChange}
            />

          ))
        )}
      </ListLayout>

      {(showAddTaskPopup || showEditTaskPopup) && (
        <SaveTask taskData={taskData} updateTaskData={updateTaskData} filteredUsers={filteredUsers} isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen} wrapperRef={wrapperRef} title={showEditTaskPopup ? "Edit Task" : "Add Task"}
          firstButtonName="Save" firstButtonOnClick={showAddTaskPopup ? handleSave : handleUpdate}
          secondButtonName="Cancel" secondButtonOnClick={() => {
            if (showAddTaskPopup) setShowAddTaskPopup(false);
            else setShowEditTaskPopup(false);
            resetTaskData();
          }} btnClassName="gradient-btn-unfocus" firstButtonDisabled={!taskData.title || !taskData.assigneeId}/>
      )}

      {showDeletePopup && selectedTask && (
        <Popup message={`Delete "${selectedTask.title}"?`} firstButtonName="Yes" secondButtonName="Cancel" btnClassName="gradient-btn-unfocus"
          firstButtonOnClick={handleDelete} secondButtonOnClick={() => setShowDeletePopup(false)}/>
      )}
    </>
  );
}
