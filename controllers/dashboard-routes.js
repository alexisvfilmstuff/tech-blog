const router = require('express').Router();
const sequelize = require('../config/connection');

// use of models directory // 
const { Post, User, Comment } = require('../models');

// authorization to redirect to login screen if not signed in // 
const withAuth = require('../utils/auth');

// render dashboard if logged in // 
router.get('/', withAuth, async (req, res) => {
  try {
    // pull database of posts // 
    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
      attributes: ['id', 'title', 'content', 'created_at'],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at',
          ],
          include: { model: User, attributes: ['username'] },
        },
        { model: User, attributes: ['username'] },
      ],
    });

    // serialize data and pass through template of dashboard // 
    const posts = postData.map((post) => post.get({ plain: true }));
    res.render('dashboard', {
      posts,
      loggedIn: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// route to edit the post information // 
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    // search via username for post // 
    const postData = await Post.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'title', 'content', 'created_at'],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at',
          ],
          include: { model: User, attributes: ['username'] },
        },
        { model: User, attributes: ['username'] },
      ],
    });
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    postDataNew = postData.get({ plain: true });
    res.render('edit-post', {
      postDataNew,
      loggedIn: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/new', (req, res) => {
  res.render('new-post', {
    layout: 'dashboard',
  });
});

module.exports = router;
