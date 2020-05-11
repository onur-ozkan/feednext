require('dotenv').config()

module.exports = {
  apps : [
    {
      name: "api_v1",
      script: "./dist/main.js",
      instances: 'max',
      instance_var: 'INSTANCE_ID',
      exec_mode: 'fork'
    }
  ]
}
