import express from 'express';

import { signup, signin, removeReport, report, getReports, getFollowUsers, signinGoogle, updateUser, following, getUserInfo, } from '../controllers/UserController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google-signin', signinGoogle)
router.post('/report', auth, report)
router.get('/report', getReports)
router.delete('/report/:uuid', removeReport)
router.patch('/:uuid/following', auth, following)
router.patch('/:uuid/update', auth, updateUser)
router.get('/:uuid/follow', getFollowUsers)
router.get('/:uuid', getUserInfo)

export default router;