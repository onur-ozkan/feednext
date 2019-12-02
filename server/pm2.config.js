require('dotenv').config()

module.exports = {
  apps : [
    {
      name: "api_1",
      script: "./dist/main.js",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: process.env.APP_PORT
      }
    },
    {
      name: "api_2",
      script: "./dist/main.js",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: process.env.APP_PORT + 1
      }
    },
    {
      name: "api_3",
      script: "./dist/main.js",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: process.env.APP_PORT + 2
      }
    },
    {
      name: "api_4",
      script: "./dist/main.js",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: process.env.APP_PORT + 3
      }
    }
  ]
}
