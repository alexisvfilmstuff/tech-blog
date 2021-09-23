const router = require('express').Router();
const { post } = require('.');
const { Post, User, Comment } = require('../models');

// home page sync and render // 
router.get('/', async (req, res) => {
  try {
    // table information // 
    const postData = await Post.findAll({
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
          // order of posts recent to past // 
          order: [['create_at', 'DESC']],
          // include username and comment in post // 
          include: { model: User, attributes: ['username'] },
        },
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at',
          ],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    }),

    // array for post // 
    const posts = postData.map(post) => post.get({ plain: true}));
    
    // post pass through homepage template // 
    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// login request render // 
router.get('/login', (req, res) => {
  // if session active goes to homepage // 
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

// sign up request render // 
router.get('/signup', (req, res) => {
  // if session active goes to homepage // 
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('signup');
});

// post request render // 
router.get('/post/:id', async (req, res) =>{
  try {
    const postData = await Post.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'content', 'title', 'created_at'],
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
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at',
          ],
        },
      ],
    }),
    
    // error if no data exist // 
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    // serialize post data // 
    const post = postData.get({ plain: true });

    // post data in template and render // 
    res.render('single-post', {
      post,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;