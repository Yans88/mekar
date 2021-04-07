import axios from 'axios';
import {
    FORM_DATA,
    FORM_DELETE,
    ADD_DATA_LOADING,
    ADD_DATA_SUCCESS,
    FETCH_DATA_NEWS_DETAIL,
    FETCH_DATA_LOADING,
    FETCH_DATA_SUCCESS_NEWS,
    FETCH_DATA_ERROR
} from '../store/reducers/types';

const API_URL = process.env.REACT_APP_URL_API;

// const normalizeResponse = (data) => {
//     const arr = data.map(item => {
//         const key = Object.keys(item);
//         key.forEach(k => {
//             item[k.toLocaleLowerCase()] = item[k];
//             delete item[k];
//         });
//         return item;
//     });
//     return arr;
// }

export const fetchDataSuccess = (data) => {
    return {
        type: FETCH_DATA_SUCCESS_NEWS,
        payload: data
    }
}

export const fetchDataDetailSuccess = (data) => {
    return {
        type: FETCH_DATA_NEWS_DETAIL,
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
        return await axios.post(API_URL + "/get_news", param)
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

export const fetchDataDetail = (param) => {
    let isLoading = true;
    return async (dispatch) => {
        dispatch(fetchDataLoading(isLoading));
        return await axios.post(API_URL + "/detail_news", param)
            .then(response => {
                const data = {};
                data['data'] = response.data.data
                dispatch(fetchDataDetailSuccess(data));
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

export const addForm = (dt) => {
    const data = {};
   
    data['showFormAdd'] = dt;
    data['isAddLoading'] = false;
    return {
        type: FORM_DATA,
        payload: data
    }
}

export const showConfirmDel = (dt) => {
    const data = {};
   
    data['showFormDelete'] = dt;
    data['isAddLoading'] = false;
    return {
        type: FORM_DELETE,
        payload: data
    }
}

export const addData = (param) => {
    let isLoading = true;
    const form = Object.keys(param).reduce((f, k) => {
        f.append(k, param[k]);
        return f;
    }, new FormData());
    return async (dispatch) => {
        const _data = {};
        dispatch(fetchAddDataLoading(isLoading));
        await axios.post(API_URL + "/add_news", form)
            .then(response => {
                const err_code = response.data.err_code;                
                if (err_code === '00') {
                    dispatch(addForm(false));
                    _data['showFormSuccess'] = true;
                    _data['tipeSWAL'] = "success";
                    _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil disimpan</div>' }} />;
                    dispatch(addDataSuccess(_data));
                } else {
                    dispatch(addForm(false));
                    isLoading = false;
                    _data['showFormSuccess'] = true;
                    _data['tipeSWAL'] = "error";
                    _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Failed</strong>, Something wrong</div>' }} />;
                    dispatch(addDataSuccess(_data));
                    dispatch(fetchAddDataLoading(isLoading));
                }

            }).catch(error => {
                console.log(error);
                dispatch(addForm(false));
                isLoading = false;
                _data['showFormSuccess'] = true;
                _data['tipeSWAL'] = "error";
                _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Failed</strong>, Something wrong</div>' }} />;
                dispatch(addDataSuccess(_data));
                dispatch(fetchAddDataLoading(isLoading));
            })
    }

}

export const deleteData = (param) => {
    let isLoading = true;
    return async (dispatch) => {
        dispatch(fetchAddDataLoading(isLoading));
        const _data = {};
        await axios.post(API_URL + "/del_news", param)
            .then(response => {
                dispatch(showConfirmDel(false));
                const err_code = response.data.err_code;
                if (err_code === '00') {
                    _data['showFormSuccess'] = true;
                    _data['tipeSWAL'] = "success";
                    _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil dihapus</div>' }} />;
                    dispatch(addDataSuccess(_data));
                } else {
                    let isLoading = false;
                    _data['showFormSuccess'] = true;
                    _data['tipeSWAL'] = "error";
                    _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Failed</strong>, Something wrong</div>' }} />;
                    dispatch(addDataSuccess(_data));
                    dispatch(fetchAddDataLoading(isLoading));
                }

            }).catch(error => {
                console.log(error);
                let isLoading = false;
                dispatch(showConfirmDel(false));
                _data['showFormSuccess'] = true;
                _data['tipeSWAL'] = "error";
                _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Failed</strong>, Something wrong</div>' }} />;
                dispatch(addDataSuccess(_data));
                dispatch(fetchAddDataLoading(isLoading));
            })
    }

}