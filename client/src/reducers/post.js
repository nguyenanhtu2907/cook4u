export default (state = [], action) => {
    switch (action.type) {
        case 'FETCH_POSTS':
            return [...state, ...action.payload];
        case 'UPDATE_POSTS':
            return state.map(post => post._id === action.payload._id ? action.payload : post)
        case 'RESET_POSTS':
            return []
        case 'REMOVE_POST':
            return state.filter(post => post.slug !== action.payload.slug)
        default:
            return state;
    }
}