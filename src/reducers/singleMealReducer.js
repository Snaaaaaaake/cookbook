const initialState = {
    meal: null,
    error: null,
    isLoading: false,
}

const singleMealReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_SINGLE_MEAL_REQUEST':
            return {
                meal: null,
                error: null,
                isLoading: true,
            }
        case 'FETCH_SINGLE_MEAL_SUCCESS':
            return {
                meal: action.payload,
                error: null,
                isLoading: false,
            }
        case 'FETCH_SINGLE_MEAL_FAILURE':
            return {
                meal: null,
                error: action.payload,
                isLoading: false,
            }
        default: return state;
    }
}
export default singleMealReducer;