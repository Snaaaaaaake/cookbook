const initialState = {
    list: [],
    error: null,
    isLoading: false,
}

const categoriesListReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_CATEGORIES_LIST_REQUEST':
            return {
                list: [],
                error: null,
                isLoading: true,
            }
        case 'FETCH_CATEGORIES_LIST_SUCCESS':
            return {
                list: action.payload,
                error: null,
                isLoading: false,
            }
        case 'FETCH_CATEGORIES_LIST_FAILURE':
            return {
                list: [],
                error: action.payload,
                isLoading: false,
            }
        default: return state;
    }
}
export default categoriesListReducer;