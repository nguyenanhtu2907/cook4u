import express from 'express';

import { signup, signin, removeReport, report, getReports, getFollowUsers, signinGoogle, updateUser, following, getUserInfo, } from '../controllers/UserController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google-signin', signinGoogle)
router.post('/report', auth, report)
router.get('/report', getReports)
router.delete('/report', removeReport)
router.patch('/following', auth, following)
router.patch('/update', auth, updateUser)
router.get('/followers', getFollowUsers)
router.get('/:uuid', getUserInfo)

export default router;