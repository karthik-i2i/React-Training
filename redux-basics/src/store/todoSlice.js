import {createSlice} from '@reduxjs/toolkit';

const todoSlice = createSlice({
    name: 'todo',
    initialState: {taskList: []},
    reducers: {
        addTask: (state, action) => {
            state.taskList.push({
                taskName: action.payload,
                isCompleted: false
            })
        },
        deleteTask: (state, action) => {
            state.taskList = state.taskList.filter((_, index) => index !== action.payload);
        },
        editTask: (state, action) => {
            const {editIndex, task} = action.payload;
            state.taskList[editIndex].taskName = task;
        },
        toggleComplete: (state, action) => {
            const index = action.payload;
            state.taskList[index].isCompleted = !state.taskList[index].isCompleted;
        }
    }
})

export const {addTask, deleteTask, editTask, toggleComplete} = todoSlice.actions;

export default todoSlice.reducer;