const express = require('express');

const {
	allUserSignup,
	login,
	restrictTo,
	createUser,
	protect,
} = require('../controllers/authControllers');

const {
	updateUser,
	resetUser,
	getAllUsers,
	acceptUser,
	deleteAvater,
	uploadImg,
	getTwoUsers,
	getMe,
	updateMe,
} = require('../controllers/userControllers');

const router = express.Router();

router.route('/signup').post(allUserSignup);
router.route('/create').post(protect, restrictTo('admin'), createUser);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);
router.route('/me').patch(protect, uploadImg, updateMe);
router.route('/getTwoUsers').get(getTwoUsers);
router
	.route('/update-user/:id')
	.patch(protect, restrictTo('user'), uploadImg, updateUser);
router
	.route('/reset-user/:id')
	.patch(protect, restrictTo('admin'), deleteAvater, resetUser);
router
	.route('/accept-user/:id')
	.patch(protect, restrictTo('admin'), acceptUser);
router.route('/').get(protect, restrictTo('admin'), getAllUsers);

module.exports = router;
