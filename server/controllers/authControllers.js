const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AllUser = require('../models/allUsersModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createAndSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};
	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
	res.cookie('jwt', token, cookieOptions);
	user.password = undefined;
	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

exports.allUserSignup = catchAsync(async (req, res, next) => {
	const { userId, password, role } = req.body;
	const newUser = await AllUser.create({ userId, password, role });
	createAndSendToken(newUser, 201, res);
});

exports.createUser = catchAsync(async (req, res, next) => {
	const { userId, password } = req.body;
	const newUser = await AllUser.create({ userId, password });

	res.status(201).json({
		status: 'success',
		data: {
			newUser,
		},
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { userId, password } = req.body;
	if (!userId || !password) {
		return next(new AppError(`Please provide userId & password`, 404));
	}
	const user = await AllUser.findOne({ userId }).select('+password');
	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError(`Incorrect userId or password`, 401));
	}
	createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	if (!token) {
		return next(
			new AppError(`You aren't logged in! Please log in to get access`, 401)
		);
	}
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	const freshUser = await AllUser.findById(decoded.id);
	if (!freshUser) {
		return next(
			new AppError(`The user belonging to this token does no longer exist`, 401)
		);
	}
	req.user = freshUser;
	next();
});

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError(`You don't have permission to perform this action`, 403)
			);
		}
		next();
	};
};
