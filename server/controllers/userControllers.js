const AllUser = require('../models/allUsersModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { uploadImage } = require('./s3bucket');
const { s3 } = require('./s3');

exports.uploadImg = uploadImage.single('image');

exports.updateUser = catchAsync(async (req, res, next) => {
	const key = req.file.key;
	const url = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${key}`;

	const doc = await AllUser.findByIdAndUpdate(
		req.params.id,
		{ ...req.body, image: url },
		{
			new: true,
			runValidators: true,
		}
	);

	if (!doc) {
		return next(new AppError('No document found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			data: doc,
		},
	});
});

exports.resetUser = catchAsync(async (req, res, next) => {
	// delete image
	const doc = await AllUser.findByIdAndUpdate(
		req.params.id,
		{ username: null, image: null, accepted: false },
		{
			new: true,
			runValidators: true,
		}
	);

	if (!doc) {
		return next(new AppError('No document found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			data: doc,
		},
	});
});

exports.deleteAvater = catchAsync(async (req, res, next) => {
	const user = await AllUser.findById(req.params.id);

	if (!user.image) {
		return next();
	}

	const parts = user.image.split(
		`https://${process.env.BUCKET_NAME}.s3.amazonaws.com/`
	);
	const key = parts[1];

	const params = {
		Bucket: `${process.env.BUCKET_NAME}`,
		Key: key,
	};
	s3.deleteObject(params, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			console.log(data);
		}
	});

	await AllUser.findByIdAndUpdate(
		req.params.id,
		{ ...req.body, image: null },
		{
			new: true,
			runValidators: true,
		}
	);

	next();
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const doc = await AllUser.find({ role: 'user' });
	res.status(200).json({
		status: 'success',
		data: {
			data: doc,
		},
	});
});

exports.getMe = catchAsync(async (req, res, next) => {
	const doc = await AllUser.findById(req.user.id);
	res.status(200).json({
		status: 'success',
		data: {
			data: doc,
		},
	});
});

exports.updateMe = catchAsync(async (req, res, next) => {
	const key = req.file.key;
	const url = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${key}`;

	const doc = await AllUser.findByIdAndUpdate(
		req.user.id,
		{ ...req.body, image: url },
		{
			new: true,
			runValidators: true,
		}
	);

	if (!doc) {
		return next(new AppError('No document found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			data: doc,
		},
	});
});

exports.getTwoUsers = catchAsync(async (req, res, next) => {
	const docs = await AllUser.find({ role: 'user' });
	const filteredDocs = docs.filter((user) => user.userId !== null).slice(-2);

	const result = filteredDocs.map((user) => ({
		_id: user._id,
		userId: user.userId,
	}));

	res.status(200).json({
		status: 'success',
		data: {
			data: result,
		},
	});
});

exports.acceptUser = catchAsync(async (req, res, next) => {
	const doc = await AllUser.findByIdAndUpdate(
		req.params.id,
		{ accepted: true },
		{
			new: true,
			runValidators: true,
		}
	);

	if (!doc) {
		return next(new AppError('No document found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			data: doc,
		},
	});
});
