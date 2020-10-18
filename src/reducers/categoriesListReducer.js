import { initialCategoriesListState } from '../store/initialStates';

const categoriesListReducer = (state = initialCategoriesListState, action) => {
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
        case 'APPLY_CATEGORIES_LIST_SERVER_STATE':
            return {
                list: action.payload.list,
                error: action.payload.error,
                isLoading: action.payload.isLoading,
            }
        default: return state;
    }
}
export default categoriesListReducer;