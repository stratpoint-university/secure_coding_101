const md5 = require("md5");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const User = require("../models/user");

exports.login = (req, res, next) => {
  try {
    res.render("login", {
      oldInput: {
        email: "",
        password: "",
      },
      errorMessage: null,
    });
  } catch (err) {
    return next(new Error(err));
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return res.status(422).render("login", {
        oldInput: {
          email,
          password,
        },
        errorMessage: errors.array()[0].msg,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(422).render("login", {
        oldInput: {
          email,
          password,
        },
        errorMessage: "Username or password doesn't match",
      });
    }

    const doMatch = md5(password) === user.password;

    if (!doMatch) {
      return res.status(422).render("login", {
        oldInput: {
          email,
          password,
        },
        errorMessage: "Username or password doesn't match",
      });
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.SECRET_KEY
    );

    res.cookie("token", token, { httpOnly: true });

    return res.redirect("/dashboard/blog");
  } catch (err) {
    return next(new Error(err));
  }
};

exports.signup = (req, res, next) => {
  try {
    res.render("sign-up", {
      errorMessage: null,
    });
  } catch (err) {
    return next(new Error(err))
  }
};

exports.postSignup = async (req, res, next) => {
  const first_name = req.body.firstname;
  const last_name = req.body.lastname;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return res.status(422).render("sign-up", {
        oldInput: {
          first_name,
          last_name,
          email,
          username,
          password,
        },
        errorMessage: errors.array()[0].msg,
      });
    }

    const hashedPW = md5(password);
    const user = new User({
      _id: uuidv4(),
      username,
      password: hashedPW,
      first_name,
      last_name,
      email,
      profile_picture_url: null,
      deleted_at: null,
      password_chances: 3,
    });

    await user.save();
    res.redirect("/login");
  } catch (err) {
    return next(new Error(err));
  }
};


exports.signOut = (req, res, next) => {
  try {
    res.clearCookie('token').redirect('/')
  } catch (err) {
    return next(new Error(err))
  }
}