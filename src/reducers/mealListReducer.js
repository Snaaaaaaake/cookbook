const initialState = {
    list: [],
    pages: 1,
    error: null,
    isLoading: false,
}

const mealListReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_MEAL_LIST_REQUEST':
            return {
                list: [],
                pages: 1,
                error: null,
                isLoading: true,
            }
        case 'FETCH_MEAL_LIST_SUCCESS':
            return {
                list: action.payload.list,
                pages: action.payload.pages,
                error: null,
                isLoading: false,
            }
        case 'FETCH_MEAL_LIST_FAILURE':
            return {
                list: [],
                pages: 1,
                error: action.payload,
                isLoading: false,
            }
        default: return state;
    }
}
export default mealListReducer;