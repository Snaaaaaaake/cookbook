import { combineReducers } from 'redux';
import categoriesListReducer from './categoriesListReducer';
import singleMealReducer from './singleMealReducer';
import mealListReducer from './mealListReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    userState: userReducer,
    singleMealState: singleMealReducer,
    categoriesListState: categoriesListReducer,
    mealListState: mealListReducer,
});

export default rootReducer;