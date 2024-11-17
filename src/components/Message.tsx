'use client';

import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store";
import {setAppMessage} from "@/store/slices/appSlice";
import classNames from "classnames";

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
                className="bg-white w-96 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl mb-4">Уведомление</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-center w-full">
                    <button
                        onClick={close}
                        className={classNames(
                            "w-full",
                            "p-3",
                            "border",
                            "border-gray-200",
                            "hover:bg-gray-200",
                        )}
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Message;
