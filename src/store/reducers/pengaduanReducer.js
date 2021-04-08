import {
   
    FETCH_DATA_LOADING,
    FETCH_DATA_PENGADUAN,
    FETCH_DATA_ERROR
} from './types';

const defaultState = {
    data: [],
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

const pengaduanReducer = (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_DATA_PENGADUAN:
            return { ...state, data: action.payload.data, totalData: action.payload.total_data }
        case FETCH_DATA_LOADING:
            return { ...state, isLoading: action.payload } 
        
        case FETCH_DATA_ERROR:
            return { ...state, error: action.payload }       
        
        default:
            return state
    }
}

export default pengaduanReducer;