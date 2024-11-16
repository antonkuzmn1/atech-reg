import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from './slices/exampleSlice';

export const store = configureStore({
    reducer: {
        example: exampleReducer,
    },
});

// Типы для стора
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
