import { initialMealListState } from '../store/initialStates';

const mealListReducer = (state = initialMealListState, action) => {
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
        case 'RESET_MEAL_LIST':
            return { ...initialMealListState }
        case 'APPLY_MEAL_LIST_SERVER_STATE':
            return {
                list: action.payload.list,
                pages: action.payload.pages,
                error: action.payload.error,
                isLoading: action.payload.isLoading,
            }
        default: return state;
    }
}
export default mealListReducer;