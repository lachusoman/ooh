const { check } = require("express-validator");
const { roles, status } = require("../constants/constants");
const { ADMIN, USER } = roles;
const { ACTIVE, INACTIVE } = status;

exports.validateUser = () => [
  check("email_id", "Invalid email").exists().isEmail(),
  check("first_name", "Please provide your first name").exists(),
  check("last_name", "Please provide your last name").exists(),
  check("user_type", "Please provide valid User Type").exists().isIn([ ADMIN, USER ]),
  check("address", "Please provide address").exists(),
  check("contact_no", "Please provide Contact Number").exists()
];

exports.validateShoppingCentre = () => [
  check("name", "Please provide name").exists(),
  check("address", "Please provide address").exists()
];

exports.validateAsset = () => [
  check("name", "Please provide name").exists(),
  check("dimension", "Please provide dimension").exists(),
  check("location", "Please provide location").exists(),
  check("status", "Please provide status").exists().isIn([ ACTIVE, INACTIVE ])
];