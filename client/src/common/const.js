export const API_ROUTER = {
    SIGN_UP: '/user/signup',
    SIGN_IN: '/user/signin',
    GOOGLE_SIGN_IN: '/user/google-signin',
    FOLLOWING: '/user/following',
    GET_USER: '/user',
    GET_FOLLOWERS: '/user/followers',
    UPDATE_USER: '/user/update',
    CREATE_POST: '/post/create-post',
    MODIFY_POST: '/post/modify',
    DELETE_POST: '/post/delete',
    GET_POST: '/post',
    GET_MORE_POST: '/post/more',
    REPORT: '/user/report',
    GET_LIKED_POST: '/post/liked',
    LIKE_POST: '/post/like',
    COMMENT_POST: '/post/comment',
    DELETE_COMMENT: '/post/delete-comment',
    SEARCH_POST: '/post/search',
};

export const initResponseType = {
    success: false,
    status: 400,
    data: null,
    message: ``,
};
