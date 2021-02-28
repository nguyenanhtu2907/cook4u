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

export const createPostApi = (newPost) => API.post(`/post/create-post`, newPost);