import * as api from "../api/index";

export const getPosts = (total, limit, target) => async (dispatch) => {
  try {
    const { data } = await api.getPostsApi({ skip: total, limit, target });
    dispatch({
      type: "FETCH_POSTS",
      payload: data.data,
    });
  } catch (error) {
    console.log(error);
  }
};
