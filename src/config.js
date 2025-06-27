// 环境配置
const config = {
  development: {
    apiBaseUrl: 'http://localhost:5001'
  },
  production: {
    apiBaseUrl: process.env.VUE_APP_API_URL || 'https://english-learning-api.onrender.com'
  }
};

// 根据当前环境选择配置
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];

export default currentConfig; 