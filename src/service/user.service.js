const models = require("../models");
const User = models.user;
const { generateAuthToken } = require("../utility/token");
const bcrypt = require("bcryptjs");

exports.userLogin = function ({ email_id, password }, callback) {
  User.findOne({
    where: { email_id }
  }).then((user) => {
    bcrypt.compare(password, user.password, async function (error, result) {
      //If passwords match,check user_type
      if (result) {
        let user_clone = { email_id: user.email_id, user_type: user.user_type }
        const authToken = generateAuthToken(user_clone);
        const loginResult = {
          token: authToken,
          email_id: user.email_id,
          first_name: user.first_name,
          last_name: user.last_name,
        }
        return callback(null, loginResult);
      } else {
        callback(`No such user or Incorrect Password`);
      }
    });
  }).catch((error) => {
    console.log(`Catch Login Error: ${error}`);
    callback(`No such user or Incorrect Password`);
  });
};

exports.userInsert = function (userData, callback) {
  bcrypt.hash(userData.password, Number(process.env.SALT), async function (err, hash) {
    if (hash) {
      try {
        const user = await User.create({ ...userData, password: hash });
        if (user) {
          callback(null, {
            status: "Record Created Successfully",
            email_id: user.email_id,
            user_type: user.user_type
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
