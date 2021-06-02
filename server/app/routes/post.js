import express from 'express';
import auth from '../middleware/auth.js';
import { getPosts,searchPosts, getLikedPosts, getMorePosts, createPost, deletePost, modifyPost, likePost, getPost, commentPost, deleteCommentPost, } from '../controllers/PostController.js';


const router = express.Router();

router.post('/create-post', auth, createPost)

router.patch('/modify', auth, modifyPost)

router.delete('/delete', auth, deletePost)

router.patch('/:slug/like', auth, likePost)

router.patch('/:slug/comment', auth, commentPost)

router.patch('/:slug/delete-comment', auth, deleteCommentPost)

router.get('/search', searchPosts)

router.get('/more', getMorePosts)

router.get('/liked', getLikedPosts)

router.get('/:slug', getPost)

router.get('/', getPosts)

export default router;