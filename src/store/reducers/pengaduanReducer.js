import {
    SHOW_CONFIRM_ONPROGRESS,
    SHOW_CONFIRM_COMPLETE,
    CONFIRM_ONPROGRESS_SUCCESS,
    FETCH_DATA_LOADING,
    FETCH_DATA_PENGADUAN,
    FETCH_DATA_ERROR,
    CONFIRM_LOADING
} from './types';

const defaultState = {
    data: [],
    totalData: 0,
    error: null,
    isLoading: false,
    isAddLoading: false,
    contentMsg: null,
    showConfirmOnprogress: false,
    showConfirmComplete: false,
    showFormSuccess: false,
    tipeSWAL: "success"
}

const pengaduanReducer = (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_DATA_PENGADUAN:
            return { ...state, data: action.payload.data, totalData: action.payload.total_data }
        case FETCH_DATA_LOADING:
            return { ...state, isLoading: action.payload }
        case FETCH_DATA_ERROR:
            return { ...state, error: action.payload }
        case SHOW_CONFIRM_ONPROGRESS:
            return {
                ...state,
                isAddLoading: action.payload.isAddLoading,
                showConfirmOnprogress: action.payload.showConfirmProgress
            }
        case SHOW_CONFIRM_COMPLETE:
            return {
                ...state,
                isAddLoading: action.payload.isAddLoading,
                showConfirmComplete: action.payload.showConfirmComplete
            }
        case CONFIRM_ONPROGRESS_SUCCESS:
            return {
                ...state,
                tipeSWAL: action.payload.tipeSWAL,
                showFormSuccess: action.payload.showFormSuccess,
                contentMsg: action.payload.contentMsg
            }
        case CONFIRM_LOADING:
            return { ...state, isAddLoading: action.payload }
        default:
            return state
    }
}

export default pengaduanReducer;