const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/auth");

const { login, signup, postLogin, postSignup, signOut } = require("../controllers/auth");

const router = express.Router();

router.get("/login", login);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password", "Password has to be Alphanumeric and minimun of 5")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  postLogin
);

router.get("/signup", signup);

router.post(
  "/signup",
  [
    body("firstname")
      .trim()
      .isAlpha()
      .withMessage("Lastname must contains only letters"),
    body("lastname")
      .trim()
      .isAlpha()
      .withMessage("Lastname must contains only letters"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("username")
      .trim()
      .isAlphanumeric()
      .withMessage("Username must contains only letters and numbers"),
    body("password", "Please enter a password with at least 5 characters.")
      .isLength({ min: 5 })
      .trim(),
  ],
  postSignup
);

router.get("/dashboard/signout", isAuth, signOut);

module.exports = router;
