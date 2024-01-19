const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

exports.s3 = new AWS.S3({
	credentials: {
		accessKeyId: `${process.env.ACCESSKEYID}`,
		secretAccessKey: `${process.env.SECRETACCESSKEY}`,
	},
	signatureVersion: 'v4',
	region: 'us-east-1',
});
