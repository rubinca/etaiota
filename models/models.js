var mongoose = require('mongoose');

// Create a connect.js inside the models/ directory that
// exports your MongoDB URI!
var connect = process.env.MONGODB_URI || require('./connect');
console.log(connect);
// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

// Create all of your models/schemas here, as properties.

var models = {
  User: mongoose.model('User', {
    username: {
      type:String,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: String,
      required: true
    },
    isPrimaryAdmin: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    }
  }),
  Event: mongoose.model('Event', {
    title: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    latitude: {
      type: String,
      required: true
    },
    longitude: {
      type: String,
      required: true
    },
    radius: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assistants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    participantsCheckedIn: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    participantsCheckedOut: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    notes: {
      type: String
    }
  })
};

module.exports = models;
