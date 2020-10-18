import { initialSingleMealState } from '../store/initialStates';

const singleMealReducer = (state = initialSingleMealState, action) => {
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
        case 'APPLY_SINGLE_MEAL_SERVER_STATE':
            return {
                meal: action.payload.meal,
                error: action.payload.error,
                isLoading: action.payload.isLoading,
            }
        default: return state;
    }
}
export default singleMealReducer;