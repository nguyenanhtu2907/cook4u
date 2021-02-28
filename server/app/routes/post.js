import express from 'express';
import auth from '../middleware/auth.js';
import {getPosts, createPost} from '../controllers/PostController.js';
const router = express.Router();

router.post('/create-post', auth,  createPost)

router.get('/', getPosts)

export default router;