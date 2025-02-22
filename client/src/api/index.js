import axios from 'axios';
import { API_ROUTER } from '../common/const';
const API = axios.create({ baseURL: 'http://localhost:5000' });
// const API = axios.create({ baseURL: 'https://cook4u.herokuapp.com/' })

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

//user
export const signupApi = (newUser) => API.post(API_ROUTER.SIGN_UP, newUser);

export const signinApi = (user) => API.post(API_ROUTER.SIGN_IN, user);

export const signinGoogleApi = (user) => API.post(API_ROUTER.GOOGLE_SIGN_IN, user);

export const followingApi = (input) => API.patch(API_ROUTER.FOLLOWING, input);

export const getInfoUserApi = (input) => API.get(`${API_ROUTER.GET_USER}/${input}`);

export const getFollowUsersApi = (uuid, type, skip) =>
    API.get(API_ROUTER.GET_FOLLOWERS, { params: { uuid, type, skip } });

export const updateUserApi = (input) => API.patch(API_ROUTER.UPDATE_USER, input);

export const reportApi = (report) => API.post(API_ROUTER.REPORT, report);

export const getReportsApi = () => API.get(API_ROUTER.REPORT);

export const removeReportApi = (uuid) => API.delete(API_ROUTER.REPORT, { params: { uuid } });

//post

export const createPostApi = (newPost) => API.post(API_ROUTER.CREATE_POST, newPost);

export const modifyPostApi = (input) => API.patch(API_ROUTER.MODIFY_POST, input);

export const deletePostApi = (slug) => API.delete(API_ROUTER.DELETE_POST, { params: { slug } });

export const getPostApi = (slug) => API.get(`${API_ROUTER.GET_POST}/${slug}`);

export const getMorePostsApi = (input) => API.get(API_ROUTER.GET_MORE_POST, { params: input });

export const getPostsApi = (input) => API.get(API_ROUTER.GET_POST, { params: { input } });

export const getLikedPostsApi = (input) => API.get(API_ROUTER.GET_LIKED_POST, { params: input });

export const likePostsApi = (input) => API.patch(API_ROUTER.LIKE_POST, input);

export const commentPostsApi = (input) => API.patch(API_ROUTER.COMMENT_POST, input);

export const deleteCommentPostsApi = (input) => API.patch(API_ROUTER.DELETE_COMMENT, input);

export const searchApi = (input) => API.get(API_ROUTER.SEARCH_POST, { params: input });
