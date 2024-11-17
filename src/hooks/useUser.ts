import {AppDispatch} from "@/store";
import {useDispatch} from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import {setAppLoading, setAppLoggedIn, setAppMessage} from "@/store/slices/appSlice";
import {useEffect} from "react";

export const useUser = () => {
    const dispatch: AppDispatch = useDispatch();

    const clear = () => {
        Cookies.remove('token');
        delete axios.defaults.headers.common['Authorization'];
        dispatch(setAppLoggedIn(false));
    }

    const check = () => {
        dispatch(setAppLoading(true));
        const token = Cookies.get('token');

        if (token) {
            axios.get('/api/auth', {
                headers: {'Authorization': `Bearer ${token}`}
            }).then((response) => {
                Cookies.set('token', token, {expires: 1});
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                dispatch(setAppLoggedIn(true));
            }).catch((error) => {
                if (error.response && error.response.data) {
                    dispatch(setAppMessage(error.response.data));
                } else {
                    dispatch(setAppMessage(error.message));
                }
                clear();
            }).finally(() => {
                dispatch(setAppLoading(false));
            });
        } else {
            clear();
            dispatch(setAppLoading(false));
        }
    }

    useEffect(() => {
        check();

        const intervalId = setInterval(() => {
            console.log('check auth');
            check();
        }, 1000 * 60 * 10);

        return () => clearInterval(intervalId);
    }, [dispatch]);
}
