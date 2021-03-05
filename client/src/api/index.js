import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' })

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
})

export const signupApi = (newUser) => API.post(`/user/signup`, newUser);
export const signinApi = (user) => API.post(`/user/signin`, user);
export const signinGoogleApi = (user) => API.post(`/user/google-signin`, user);
export const followingApi = (uuid, target) => API.patch(`/user/${uuid}/following?target=${target}`);
export const getInfoUserApi = (uuid) => API.get(`/user/${uuid}`)
export const updateUserApi = (uuid, setting, formValues) => API.patch(`/user/${uuid}/update?setting=${setting}`, formValues)

export const createPostApi = (newPost) => API.post(`/post/create-post`, newPost);
export const modifyPostApi = (slug, newPost) => API.patch(`/post/${slug}/modify`, newPost);
export const deletePostApi = (slug) => API.delete(`/post/${slug}/delete`);
export const getPostApi = (slug) => API.get(`/post/${slug}`);
export const getMorePostsApi = (slug, uuid) => API.get(`/post/${slug}/more?user=${uuid}`);
//quite complex
export const getPostsApi = (total, limit, target) => API.get(`/post?skip=${total}&limit=${limit}${target ? `&target=${target}` : ''}`);
export const getLikedPostsApi = (total, limit, target) => API.get(`/post/liked?skip=${total}&limit=${limit}${target ? `&target=${target}` : ''}`);
export const likePostsApi = (slug, user) => API.patch(`/post/${slug}/like?user=${user}`);
export const commentPostsApi = (slug, user, comment) => API.patch(`/post/${slug}/comment?user=${user}`, comment);
export const deleteCommentPostsApi = (slug, user, createdAt) => API.patch(`/post/${slug}/delete-comment?user=${user}`, createdAt);
// export const getPostApi = (slug) => API.get(`/post/${slug}`);