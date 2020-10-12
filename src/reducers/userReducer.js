const initialState = {
    user: null,
    listenerRef: null,
    favorites: [],
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_CHANGE':
            return {
                user: action.payload.user,
                listenerRef: action.payload.listenerRef,
                favorites: [],
            }
        case 'USER_FAVORITES_CHANGE': 
            return {
                ...state,
                favorites: action.payload,
            }
        default: return state;
    }
}
export default userReducer;