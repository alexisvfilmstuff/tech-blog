const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const session = require('express-session');
const withAuth = require('../../utils/auth');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// route to user database // 
router.get('/', (req, res) => {
  // access to user model to see all users // 
  User.findAll({
    // exclude password from data being pulled // 
    attributes: { exclude: ['password'] },
  })
    // get data back in json format // 
    .then((dbUserData) => res.json(dbUserData))
    // if server hits error return error // 
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// route to get single user id // 
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    // get id as parameter // 
    where: {
      id: req.params.id,
    },
    // include all data of user id searched // 
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'content', 'created_at'],
      },

      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: Post,
          attributes: ['title'],
        },
      },
    ],
  })
    .then((userData) => {
      if (!userData) {
        // if no user is found return error // 
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      // else return the data for logged in user // 
      res.json(userData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// created data for new user route // 
router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })
    .then((userData) => {
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.username = userData.username;
        req.session.loggedIn = true;
        res.json(userData);
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// route for login request // 
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { username: req.body.username },
    });
    if (!userData) {
      res.status(400).json({ message: 'No user with that username!' });
      return;
    }
    const validPassword = userData.checkPassword(req.body.password);
    // if password is invalid return error // 
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.loggedIn = true;
      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// log out session // 
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// update user from database // 
router.put('/:id', withAuth, (req, res) => {
  User.update(req.body, {
    // hook to hash only the password // 
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((userData) => {
      if (!userData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(userData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// delete user from database // 
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((userData) => {
      if (!userData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(userData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
