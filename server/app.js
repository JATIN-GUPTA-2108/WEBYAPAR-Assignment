const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');

const allUserRouter = require('./routes/allUserRoutes');

const app = express();

app.enable('trust proxy');

app.use(
	cors({
		origin: '*',
		credentials: true,
	})
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(express.json());

app.use(helmet());
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());
app.use(xss());

app.use(express.static(path.join(__dirname, 'views')));

app.use('/api/v1/allUser', allUserRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
