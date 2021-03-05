import * as api from '../api/index';

export const getPosts = (total, limit, target) => async (dispatch) => {
    try {
        const { data } = await api.getPostsApi(total, limit, target)
        dispatch({
            type: 'FETCH_POSTS',
            payload: data,
        })
    } catch (error) {
        console.log(error);
    }
}