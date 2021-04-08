import axios from 'axios';
import {
    ADD_DATA_LOADING,
    ADD_DATA_SUCCESS,
    ADD_DATA_ERROR,
    CLEAR_ADD_DATA_ERROR,
    FETCH_DATA_LOADING,
    FETCH_DATA_PENGADUAN,
    FETCH_DATA_ERROR
} from '../store/reducers/types';

const API_URL = process.env.REACT_APP_URL_API;

export const fetchDataSuccess = (data) => {
    return {
        type: FETCH_DATA_PENGADUAN,
        payload: data
    }
}

export const fetchDataLoading = (data) => {
    return {
        type: FETCH_DATA_LOADING,
        payload: data
    }
}

export const fetchAddDataLoading = (data) => {
    return {
        type: ADD_DATA_LOADING,
        payload: data
    }
}

export const fetchDataError = (data) => {
    return {
        type: FETCH_DATA_ERROR,
        payload: data
    }
}

export const addDataError = (data) => {
    return {
        type: ADD_DATA_ERROR,
        payload: data
    }
}

export const clearAddDataError = (data)=>{
    return {
        type: CLEAR_ADD_DATA_ERROR,
        payload: data
    }
}

export const addDataSuccess = (data) => {
    return {
        type: ADD_DATA_SUCCESS,
        payload: data
    }
}

export const fetchData = (param) => {
    let isLoading = true;
    return async (dispatch) => {
        dispatch(fetchDataLoading(isLoading));
        return await axios.post(API_URL + "/history_pengaduan", param)
            .then(response => {
                const data = {};
                data['data'] = response.data.data
                data['total_data'] = response.data.total_data
                dispatch(fetchDataSuccess(data));
                isLoading = false;
                dispatch(fetchDataLoading(isLoading));
            }).catch(error => {
                const errorpayload = {};
                errorpayload['message'] = 'Something wrong';
                errorpayload['status'] = error.response ? error.response.status : 404;
                dispatch(fetchDataError(errorpayload));
                isLoading = false;
                dispatch(fetchDataLoading(isLoading));
            })
    }
}