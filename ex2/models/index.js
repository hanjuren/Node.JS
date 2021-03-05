const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const Post = require('./post');
const User = require('./user');
const Comment = require('./comment');

const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Post = Post;
db.User = User;
db.Comment = Comment;

Post.init(sequelize);
User.init(sequelize);
Comment.init(sequelize);

Post.associate(db);
User.associate(db);
Comment.associate(db);

module.exports = db;