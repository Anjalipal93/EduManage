// Configuration file for EduManage Backend
// Use this if .env file doesn't work

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/edumanage',
  JWT_SECRET: process.env.JWT_SECRET || 'edumanage_secret_key_2025_change_this_in_production',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

