const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// user_id foreignkey relationship // 
Post.belongsTo(User, {
  foreignKey: 'user_id',
});

// postID foreignkey relationship // 
Post.hasMany(Comment, {
  foreignKey: 'postId',
  onDelete: 'CASCADE',
  hooks: true,
});

// comment.user foreignkey relationship // 
Comment.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  hooks: true,
});

// comment-post foreignkey relationship // 
Comment.belongsTo(Post, {
  foreignKey: 'user_id',
  onDelete: 'cascade',
  hooks: true,
});

// user-post foreignkey relationship // 
User.hasMany(Post, {
  foreignKey: 'user_id',
});

// user-comment foreignkey relationship // 
User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'cascade',
  hooks: true,
});

module.exports = { User, Post, Comment };
