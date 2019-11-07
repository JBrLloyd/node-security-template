const express = require('express');
const config = require('config');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const redis = require('redis');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Ajv = require('ajv');
const ajv = new Ajv({ useDefaults: true });

// Internal Modules
const logger = require('./loaders/logger');
const authController = require('./controllers/AuthController');

const app = express();

// Basic Web Server Security
app.enable('trust proxy');
app.use(helmet());
app.use(cors());
// Body parsers is required before HPP (HTTP Parameter Pollution) in the middleware pipeline
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(hpp());

// session store
let RedisStore = require('connect-redis')(session)
let client = redis.createClient({
  url: process.env.REDIS_URL || config.get('REDIS_URL')
})
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET || config.get('SESSION_SECRET'),
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 15 * 60 * 1000
  },
  store: new RedisStore({ client })
}));

// Prevent DDoS with rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15mins
  max: 100 // 100 reqs for an IP per windowsMs
})
app.use(limiter);

// app.use('/', authController.router);

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);

  res.status(err.status || 500);

  res.json({
    'errors': {
      message: err.message,
      error: err
    }
  });
});

var server = app.listen(process.env.PORT || config.get('PORT'), () => {
  logger.info(`Server is running on ${config.util.getEnv('HOSTNAME')}:${server.address().port}`);
});
