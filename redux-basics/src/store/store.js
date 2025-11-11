import {configureStore} from '@reduxjs/toolkit';
import counterReducer from './counterSlice.js';
import todoReducer from './todoSlice.js';

const store = configureStore({
    reducer: {
        counter: counterReducer,
        todo: todoReducer,
    }
});

export default store;

