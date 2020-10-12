function thunkActionCreator(requestAction, successAction, failureAction) {
    return (service, fetchState, ...rest) => (dispatch) => {
        dispatch(requestAction());
        service(...rest)
        .then(data => {
                if (!fetchState.canceled) {
                    dispatch(successAction(data))
                }
            })
        .catch(error => dispatch(failureAction(error)))
    }
}

const fetchSingleMealRequestAction = () => ({
    type: 'FETCH_SINGLE_MEAL_REQUEST',
});
const fetchSingleMealSuccessAction = (data) => ({
    type: 'FETCH_SINGLE_MEAL_SUCCESS',
    payload: data,
});
const fetchSingleMealFailureAction = (data) => ({
    type: 'FETCH_SINGLE_MEAL_FAILURE',
    payload: data,
});
const fetchSingleMealThunkAction = thunkActionCreator(
    fetchSingleMealRequestAction,
    fetchSingleMealSuccessAction,
    fetchSingleMealFailureAction,
);

const fetchMealListRequestAction = () => ({
    type: 'FETCH_MEAL_LIST_REQUEST',
});
const fetchMealListSuccessAction = (data) => ({
    type: 'FETCH_MEAL_LIST_SUCCESS',
    payload: data,
});
const fetchMealListFailureAction = (data) => ({
    type: 'FETCH_MEAL_LIST_FAILURE',
    payload: data,
});
const fetchMealListThunkAction = thunkActionCreator(
    fetchMealListRequestAction,
    fetchMealListSuccessAction,
    fetchMealListFailureAction,
);

const fetchCategoriesListRequestAction = () => ({
    type: 'FETCH_CATEGORIES_LIST_REQUEST',
});
const fetchCategoriesListSuccessAction = (data) => ({
    type: 'FETCH_CATEGORIES_LIST_SUCCESS',
    payload: data,
});
const fetchCategoriesListFailureAction = (data) => ({
    type: 'FETCH_CATEGORIES_LIST_FAILURE',
    payload: data,
});
const fetchCategoriesListThunkAction = thunkActionCreator(
    fetchCategoriesListRequestAction,
    fetchCategoriesListSuccessAction,
    fetchCategoriesListFailureAction,
);

const userChangeAction = (data) => ({
    type: 'USER_CHANGE',
    payload: data,
});
const userFavoritesChangeAction = (data) => ({
    type: 'USER_FAVORITES_CHANGE',
    payload: data,
});
const userAndListenerChangeThunkAction = (newUser, service) => (dispatch, getState) => {
    const { userState } = getState();
    let user, listenerRef;
    // Если есть старый слушатель, то отключаем его,
    // т.к. пользователь скорее всего разлогинился
    const oldListenerRef = userState.listenerRef;
    if (oldListenerRef) {
        oldListenerRef.off();
    }
    if (newUser) {
        user = newUser;
        const { uid } = newUser;
        listenerRef = service.database.ref(`/users/${uid}/favorites`)
    } else {
        user = null;
        listenerRef = null;
    }
    dispatch(userChangeAction({ user, listenerRef }));
    //Включаем новый слушатель на запись избранного на бэкенде
    if (listenerRef) {
        listenerRef.on('value', snapshot => {
            const value = snapshot.val() || [];
            dispatch(userFavoritesChangeAction(value));
        });
    }
}

export {
    fetchSingleMealRequestAction,
    fetchSingleMealSuccessAction,
    fetchSingleMealFailureAction,
    fetchSingleMealThunkAction,
    fetchMealListRequestAction,
    fetchMealListSuccessAction,
    fetchMealListFailureAction,
    fetchMealListThunkAction,
    fetchCategoriesListRequestAction,
    fetchCategoriesListSuccessAction,
    fetchCategoriesListFailureAction,
    fetchCategoriesListThunkAction,
    userAndListenerChangeThunkAction,
}