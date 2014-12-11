"use strict";

var bcrypt = require('bcrypt');


module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5,1000],
          msg: "Please Use a password at least 5 letters"
        }
      }
    },
    name: DataTypes.STRING
  }, 
  { 
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks: {
      beforeCreate: function(data, garbage, sendback) {
        var passwordToEncrypt = data.password;
        bcrypt.hash(passwordToEncrypt, 10, function (err, hash) {          
          data.password = hash;
          sendback(null, data);
        })
      }
    }
  
});

  return user;
};
