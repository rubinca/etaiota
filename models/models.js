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
    }
  })
};

module.exports = models;
