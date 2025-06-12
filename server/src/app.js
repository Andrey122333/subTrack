const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const client = require('prom-client');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

const dbName = process.env.NODE_ENV === 'test' ? 'subscriptions_test' : 'subscriptions';
const HOST = process.env.NODE_ENV === 'test' ? 'mongo-test' : 'mongo';


mongoose.connect(`mongodb://admin:password@${HOST}:27017/${dbName}?authSource=admin`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(`Connected to database: ${dbName}`);
}).catch(err => {
  console.error('Database connection error:', err);
});

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code', 'pod'], // Добавили pod здесь
  buckets: [50, 100, 200, 300, 400, 500, 1000]
});

register.registerMetric(httpRequestDurationMicroseconds);

app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    const podName = process.env.HOSTNAME || 'unknown';
    
    end({ 
      method: req.method, 
      route: req.url, 
      status_code: res.statusCode,
      pod: podName 
    });
  });
  next();
});


app.use('/api/subscriptions', subscriptionRoutes);

module.exports = app;
