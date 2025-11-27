import './save-task.css';
import Popup from '../popup/Popup';

export default function SaveTask({taskData, updateTaskData, filteredUsers, isDropdownOpen, setIsDropdownOpen, wrapperRef, title,
    firstButtonName, firstButtonOnClick, firstButtonDisabled, secondButtonName, secondButtonOnClick, btnClassName}) {

  return (
     <Popup firstButtonName={firstButtonName} firstButtonOnClick={firstButtonOnClick} firstButtonDisabled={firstButtonDisabled} 
              secondButtonName={secondButtonName} btnClassName={btnClassName}
              secondButtonOnClick={secondButtonOnClick}>
      <div className="save-task-form">
        <h2>{title}</h2>
        <input type="text" className="input-field" placeholder="*Task Title" value={taskData.title} onChange={(e) => updateTaskData('title', e.target.value)}/>
        <textarea className="input-field" placeholder="Task Description"
          value={taskData.description} onChange={(e) => updateTaskData('description', e.target.value)} style={{ height: '80px', resize: 'none' }}/>
        <div className="status-group">
          <label>
            <input type="radio" checked={taskData.status === 'Todo'} onChange={() => updateTaskData('status', 'Todo')}/>
            Todo
          </label>
          <label>
            <input type="radio" checked={taskData.status === 'In progress'} onChange={() => updateTaskData('status', 'In progress')}/>
            In Progress
          </label>
          <label>
            <input type="radio" checked={taskData.status === 'Completed'} onChange={() => updateTaskData('status', 'Completed')}/>
            Completed
          </label>
        </div>
        <div className="assignee-wrapper" ref={wrapperRef}>
          <input type="text" className="input-field" placeholder="*Assign to a user" value={taskData.assigneeSearch} onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              updateTaskData('assigneeSearch', e.target.value);
              setIsDropdownOpen(true);
            }}/>
          {isDropdownOpen && (
            <div className="assignee-dropdown">
              {filteredUsers.length === 0 ? (
                <div className="assignee-item no-match">No matches</div>
              ) : (
                filteredUsers.map((u) => (
                  <div className="assignee-item" key={u.id}
                    onClick={() => {
                      updateTaskData('assigneeId', u.id);
                      updateTaskData('assigneeSearch', u.email);
                      setIsDropdownOpen(false);
                    }}>
                    {u.email}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
}