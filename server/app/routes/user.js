import express from 'express';

import { signup, signin, signinGoogle } from '../controllers/UserController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google-signin', signinGoogle)

export default router;