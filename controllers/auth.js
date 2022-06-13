const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn)
  // const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1] === 'true';
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
    User.findById('629529d304fc4a68e7a90af4')
      .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        res.redirect('/');
      })
      .catch(err => console.log(err));
  };

exports.postLogout = (req, res, next) => {
  req.session.destroy((err)=>{
    console.log(err);
    res.redirect('/');
  })
  
};