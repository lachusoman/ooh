const models = require("../models");
const User = models.user;
const { generateAuthToken } = require("../utility/token.util");
const bcrypt = require("bcryptjs");

exports.userLogin = function ({ email_id, password }, callback) {
  User.findOne({
    where: { email_id }
  }).then((user) => {
    bcrypt.compare(password, user.password, async function (error, result) {
      if (result) {
        const authToken = generateAuthToken(user);
        return callback(null, authToken);
      } else {
        callback({ msg: `Incorrect Password`, error });
      }
    });
  }).catch((error) => {
    callback({ msg: `Invalid Email-id`, error });
  });
};

exports.userInsert = function (userData, callback) {
  bcrypt.hash(userData.password, Number(process.env.SALT), async function (err, hash) {
    if (hash) {
      try {
        const user = await User.create({ ...userData, password: hash });
        if (user) {
          callback(null, {
            status: "SUCCESS",
            msg: "User created successfully"
          });
        }
      } catch (error) {
        const err = error.errors;
        let errorMessage = null;
        if (err) {
          err.forEach(element => errorMessage = element.message);
          return callback(errorMessage);
        }
        return callback(error);
      }
    } else {
      callback(err);
    }
  });
};
