const express = require('express'),
      config = require('config'),
      helmet = require('helmet'),
      cors = require('cors'),
      hpp = require('hpp'),
      rateLimit = require('express-rate-limit'),
      redis = require('redis'),
      bodyParser = require('body-parser');

import logger from './loaders/logger';

const app = express();
const redisClient = redis.createClient();

// Basic Web Server Security
app.use(helmet());
app.use(cors());

// Body parsers is required before HPP (HTTP Parameter Pollution) in the middleware pipeline
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(hpp());

// Prevent DDoS with rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15mins
  max: 100 // 100 reqs for an IP per windowsMs
})
app.use(limiter);

const PORT = process.env.PORT || config.get('PORT');

app.get('/',
  (req, res) => {
    res.send("<h1>Hello World</h1>");
});

app.listen(PORT, () => {
  logger.info(`Server is running on ${config.util.getEnv('HOSTNAME')}:${PORT}`);
});
