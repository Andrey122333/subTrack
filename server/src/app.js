const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Определяем имя базы: если тесты, то используем "subscriptions_test", иначе "subscriptions"
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

// Маршруты
app.use('/api/subscriptions', subscriptionRoutes);

module.exports = app;
