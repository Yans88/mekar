const initialState = {
     b: 2
}

const reducer = (state = initialState, action) => {
    if (action.type === 'UPDATE_B') {
        return {
            ...state,
            b: action.a + state.b
        }
    }
    return state;
}

export default reducer;