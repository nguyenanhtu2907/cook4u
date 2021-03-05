import express from 'express';

import { signup, signin, signinGoogle, updateUser, following, getUserInfo, } from '../controllers/UserController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google-signin', signinGoogle)
router.patch('/:uuid/following', auth, following)
router.patch('/:uuid/update', updateUser)
router.get('/:uuid', getUserInfo)

export default router;