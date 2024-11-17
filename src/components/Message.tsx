'use client';

import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store";
import {setAppMessage} from "@/store/slices/appSlice";

const Message = () => {
    const dispatch = useDispatch();
    const message = useSelector((state: RootState) => state.app.message);

    const close = () => {
        dispatch(setAppMessage(''));
    };

    if (!message) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={close}
        >
            <div
                className="bg-white rounded-lg shadow-lg w-96 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4">Уведомление</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={close}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Message;
