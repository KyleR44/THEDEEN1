module.exports = function(app, passport, db) {
  //to render chatroom

  // app.get('/chatroom', function(req, res){
  //   res.render('chatroom.ejs');
  // });

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('home.ejs');
  });

  app.get('/chat', function(req, res){
  res.render('chat.ejs');
});

  // PROFILE SECTION =========================
  // app.get('/profile', isLoggedIn, function(req, res) {
  //     db.collection('messages').find().toArray((err, result) => {
  //       if (err) return console.log(err)
  //       res.render('profile.ejs', {
  //         user : req.user,
  //         messages: result
  //       })
  //     })
  // });


  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================

  // app.post('/messages', (req, res) => {
  //   db.collection('messages').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
  //     if (err) return console.log(err)
  //     console.log('saved to database')
  //     res.redirect('/profile')
  //   })
  // })
  function flightCost(){
      let money = Math.floor( Math.random () * (2000 - 1000 + 1) + 1000);
      let monthly = (Math.floor(money/12));
     console.log(monthly, money);

     return {money:money,
            monthly:monthly}

    }

  app.post('/calcHome', function(req, res){
      let costs = flightCost()
      console.log(req.body.flightEstimate, req.body.breakDwn);
      console.log(costs)
      res.render('calcHome.ejs', {
        money : costs.money,
        monthly : costs.monthly
      })

  })

  // app.put('/messages', (req, res) => {
  //   db.collection('messages')
  //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
  //     $set: {
  //       thumbUp:req.body.thumbUp + 1
  //     }
  //   }, {
  //     sort: {_id: -1},
  //     upsert: true
  //   }, (err, result) => {
  //     if (err) return res.send(err)
  //     res.send(result)
  //   })
  // })
  //
  // app.delete('/messages', (req, res) => {
  //   db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
  //     if (err) return res.send(500, err)
  //     res.send('Message deleted!')
  //   })
  // })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/signIn', function(req, res) {
    res.render('signIn.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/signIn', passport.authenticate('local-login', {
    successRedirect : '/fatiha', // redirect to the secure profile section
    failureRedirect : '/signIn', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.get('/fatiha', isLoggedIn, function(req, res) {
    res.render('fatiha.ejs');
  });

  app.get('/calcHome', isLoggedIn, function(req, res) {
    res.render('calcHome.ejs');
  });

  // app.get('/calcRes', function(req, res) {
  //   res.render('calcRes.ejs');
  // });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/fatiha', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  //  app.post('/results', function(req, res) {
  // let money = Math.floor( Math.random () * (2000 - 1000 + 1) + 1000);
  // let monthly = (Math.floor(money/12));
  // successRedirect : '/calcRes', // redirect to the secure profile section
  // failureRedirect : '/calcHome', // redirect back to the signup page if there is an error
  // failureFlash : true // allow flash messages
  // console.log(req.body);
  // res.render('calcRes.ejs')
  //})

  app.put('/calcHome', (req, res) => {

    db.collection('users')
    .findOneAndUpdate({startDate: req.body.startDate, endDate: req.body.endDate, flightEstimate: req.body.flightEstimate, breakDwn: req.body.breakDwn}, {
      $set: {
        flightEstimate:req.body.flightEstimate,
        breakDwn:req.body.breakDwn
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })



  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
  return next();

  res.redirect('/');
}
