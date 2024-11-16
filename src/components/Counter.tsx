'use client';

import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '@/store';
import {increment, decrement} from '@/store/slices/exampleSlice';

export default function Counter() {
    const dispatch = useDispatch();
    const value = useSelector((state: RootState) => state.example.value);

    return (
        <div className="p-4">
            <h1 className="text-2xl">Счётчик: {value}</h1>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                onClick={() => dispatch(increment())}
            >
                Увеличить
            </button>
            <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => dispatch(decrement())}
            >
                Уменьшить
            </button>
        </div>
    );
}
