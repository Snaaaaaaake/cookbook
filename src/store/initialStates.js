const initialSingleMealState = {
    meal: null,
    error: null,
    isLoading: false,
}
const initialMealListState = {
    list: [],
    pages: 1,
    error: null,
    isLoading: false,
}
const initialCategoriesListState = {
    list: [],
    error: null,
    isLoading: false,
}
const initialUserState = {
    user: null,
    listenerRef: null,
    favorites: [],
}

export {
    initialSingleMealState,
    initialMealListState,
    initialCategoriesListState,
    initialUserState,
}