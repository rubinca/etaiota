var express = require('express');
var router = express.Router();
var models = require('../models/models')
var User = models.User;
var Evnt = models.Event;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  }
  var isAdmin = req.user.isAdmin == 'true' ? true : false;
  Evnt.find()
      .then(function(evnts) {
        res.render('home', { title: 'Home', isAdmin: isAdmin, 'events': evnts});
      })
});

router.get('/eventView/:id', function(req, res, next) {
  Evnt.findOne({'_id': req.params.id})
      .then(function(evnt) {
        res.render('eventInfoUser.hbs', {'event': evnt})
      })
})

router.get('/eventCheckIn/:id', function(req, res, next) {
  Evnt.findOne({'_id': req.params.id})
      .then(function(evnt) {
        res.render('eventCheckIn.hbs', {'event': evnt, 'API_KEY': process.env.GOOGLE_API_KEY, 'userId': req.user._id});
      })
})

router.get('/validateCheckIn', function(req, res, next) {
  Evnt.findByIdAndUpdate(req.query.eventId,
				{$push: {"participantsCheckedIn": req.query.userId}},
				{safe: true, upsert: true},
				function(err, area) {
					res.status(200).send('Checked in!');
				})
})

router.get('/user', function(req, res, next) {
  User.findOne({"_id": req.user._id})
      .then(function(user) {
        res.render('user', {"user": user});
      })
})


//admin only routes
router.use(function(req, res, next) {
  if (!req.user) {
    res.redirect('/');
  }
	else if (req.user.isAdmin == "true") {
		next();
	}
	else {
		res.redirect('/home')
	}
});


router.get('/admin', function(req, res, next) {
  Evnt.find()
      .then(function(evnts) {
        res.render('adminDashboard', {'events': evnts});
      })
})

router.get('/event', function(req, res, next) {
  res.render('editEvent');
})

router.get('/event/:id', function(req, res, next) {
  Evnt.findOne({'_id': req.params.id})
      .then(function(e) {
        res.render('editEvent', {
          'event': e
        });
      })
})

router.post('/event/:id', function(req, res, next) {
  Evnt.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    radius: req.body.radius,
    date: req.body.date,
    notes: req.body.notes
  }).then(function(e) {
    res.redirect('/eventInfo/' + req.params.id)
  })
})

router.get('/eventInfo/:id', function(req, res, next) {
  Evnt.findOne({'_id': req.params.id})
      .populate('participants assistants owner')
      .then(function(e) {
        res.render('eventInfo', {'event': e, 'ownerName': e.owner.firstName + " " + e.owner.lastName})
      })
})

router.get('/eventCheckIn/:id', function(req, res, next) {
  Evnt.findOne({'_id': req.params.id})
      .then(function(e) {
        res.render('eventCheckIn', {'latitude': e.latitude, 'longitude': e.longitude, 'API_KEY': process.env.GOOGLE_API_KEY})
      })
})

router.post('/event', function(req, res, next) {
  new Evnt({
    owner: req.user._id,
    participants: [req.user._id],
    assistants: [],
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    date: req.body.date,
    notes: req.body.notes,
    title: req.body.title,
    radius: req.body.radius
  }).save()
    .then(function(evnt) {
      res.redirect('/admin');
    })
    .catch(function(error) {
      next(error)
    })
})

module.exports = router;
