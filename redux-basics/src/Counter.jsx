import {useSelector, useDispatch} from 'react-redux'
import {increment, decrement, reset} from './store/counterSlice.js'

export default function Counter() {
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    return (
        <div className='counterBody'>
            <h1>Counter: {count}</h1>
            <div className='counterButtons'>
                <button onClick={() => dispatch(increment())}>Increment</button>
                <button onClick={() => dispatch(decrement())}>Decrement</button>
                <button onClick={() => dispatch(reset())}>Reset</button>
            </div>
        </div>
    );
}


