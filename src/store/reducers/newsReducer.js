import {
    FORM_DATA,
    FORM_DELETE,
    ADD_DATA_LOADING,
    ADD_DATA_SUCCESS,
    FETCH_DATA_NEWS_DETAIL,
    FETCH_DATA_LOADING,
    FETCH_DATA_SUCCESS_NEWS,
    FETCH_DATA_ERROR
} from './types';

const defaultState = {
    data: [],
    dataEdit: {},
    totalData: 0,
    error: null,
    isLoading: false,
    isAddLoading: false,
    errorPriority: null,
    contentMsg: null,
    showFormAdd: false,
    showFormSuccess: false,
    showFormDelete: false,
    tipeSWAL: "success"
}

const newsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_DATA_SUCCESS_NEWS:
            return { ...state, data: action.payload.data, totalData: action.payload.total_data }
        case FETCH_DATA_NEWS_DETAIL:
            return { ...state, dataEdit: action.payload.data }
        case FETCH_DATA_LOADING:
            return { ...state, isLoading: action.payload }
        case FORM_DATA:
            return {
                ...state,
                isAddLoading: action.payload.isAddLoading,
                showFormAdd: action.payload.showFormAdd,
            }
        case FORM_DELETE:
            return {
                ...state,
                isAddLoading: action.payload.isAddLoading,
                showFormDelete: action.payload.showFormDelete,
            }
        case ADD_DATA_LOADING:
            return { ...state, isAddLoading: action.payload }
        case FETCH_DATA_ERROR:
            return { ...state, error: action.payload }
        case ADD_DATA_SUCCESS:
            return {
                ...state,
                tipeSWAL: action.payload.tipeSWAL,
                showFormSuccess: action.payload.showFormSuccess,
                contentMsg: action.payload.contentMsg
            }
        default:
            return state
    }
}

export default newsReducer;