import axios from 'axios';
import {
    CONFIRM_LOADING,
    FETCH_DATA_LOADING,
    FETCH_DATA_PENGADUAN,
    FETCH_DATA_ERROR,
    SHOW_CONFIRM_ONPROGRESS,
    CONFIRM_ONPROGRESS_SUCCESS,
    SHOW_CONFIRM_COMPLETE
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

export const fetchConfirmLoading = (data) => {
    return {
        type: CONFIRM_LOADING,
        payload: data
    }
}

export const fetchDataError = (data) => {
    return {
        type: FETCH_DATA_ERROR,
        payload: data
    }
}

export const showConfirmOnprogress = (dt) => {
    const data = {};
    data['showConfirmProgress'] = dt;
    data['isAddLoading'] = false;
    return {
        type: SHOW_CONFIRM_ONPROGRESS,
        payload: data
    }
}

export const showConfirmCompleted = (dt) => {
    const data = {};
    data['showConfirmComplete'] = dt;
    data['isAddLoading'] = false;
    return {
        type: SHOW_CONFIRM_COMPLETE,
        payload: data
    }
}

export const confirmSuccess = (data) => {
    return {
        type: CONFIRM_ONPROGRESS_SUCCESS,
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

export const updStatus = (param) => {
    let isLoading = true;
    return async (dispatch) => {
        dispatch(fetchConfirmLoading(isLoading));
        const _data = {};
        await axios.post(API_URL + "/upd_status_pengaduan", param)
            .then(response => {
                dispatch(showConfirmCompleted(false));
                dispatch(showConfirmOnprogress(false));
                _data['showFormSuccess'] = true;
                _data['tipeSWAL'] = "success";
                _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil diupdate</div>' }} />;
                dispatch(confirmSuccess(_data));

            }).catch(error => {
                console.log(error);
                dispatch(showConfirmOnprogress(false));
                dispatch(showConfirmCompleted(false));
                isLoading = false;
                _data['showFormSuccess'] = true;
                _data['tipeSWAL'] = "error";
                _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Failed</strong>, Something wrong</div>' }} />;
                dispatch(confirmSuccess(_data));
                dispatch(fetchConfirmLoading(isLoading));
            })
    }

}