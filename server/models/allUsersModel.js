const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const allUserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			default: null,
		},
		image: {
			type: String,
			default: null,
		},
		accepted: {
			type: Boolean,
			default: false,
		},
		userId: {
			type: Number,
			required: [true, 'must provied a user id'],
			default: 0,
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'please provide a password'],
			minlength: 8,
			select: false,
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

allUserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);

	next();
});

allUserSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

const AllUser = mongoose.model('AllUser', allUserSchema);

module.exports = AllUser;
