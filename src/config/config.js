require('dotenv').config()

const config = {
  PORT: process.env.PORT || 7000,
  MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/demo_app"
}

export default Object.freeze(config);
