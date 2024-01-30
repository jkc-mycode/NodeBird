const Sequelize = require('sequelize');
// const User = require('./user');
// const Post = require('./post');
// const Hashtag = require('./hashtag');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};
const sequelize = new Sequelize(  // config에 있는 설정값들을 통해 시퀄라이즈 연결방법
  config.database, config.username, config.password, config,
);

// DB에 config에서 가져온 설정값을 기반으로 시퀄라이즈 적용
db.sequelize = sequelize;

// db.User = User;
// db.Post = Post;
// db.Hashtag = Hashtag;

// User.initiate(sequelize);
// Post.initiate(sequelize);
// Hashtag.initiate(sequelize);
// User.associate(db);
// Post.associate(db);
// Hashtag.associate(db);

const basename = path.basename(__filename);
fs.readdirSync(__dirname)
  .filter(file => {
    return  file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
    model.initiate(sequelize);
  });

Object.keys(db).forEach(modelName => {
  console.log(modelName);
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;