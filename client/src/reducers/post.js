const postReducer = (state = { posts: [], total: 0 }, action) => {
  switch (action.type) {
    case "FETCH_POSTS":
      return {
        posts: [...state.posts, ...action.payload.posts],
        total: action.payload.total,
      };
    case "UPDATE_POSTS":
      return {
        posts: [
          ...state.posts.map((post) =>
            post._id === action.payload._id ? action.payload : post
          ),
        ],
        total: state.total - 1,
      };
    case "RESET_POSTS":
      return { posts: [], total: 0 };
    case "REMOVE_POST":
      return {
        posts: [
          ...state.posts.filter((post) => post.slug !== action.payload.slug),
        ],
        total: state.total - 1,
      };
    default:
      return state;
  }
};

export default postReducer;
