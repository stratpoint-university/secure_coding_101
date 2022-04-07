const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    if (!req.cookies.token) {
      return res.redirect("/login");
    }
    let decodedToken = jwt.verify(req.cookies.token, process.env.SECRET_KEY);

    if (!decodedToken) {
      return res.redirect("/login");
    }
    const userData = await User.findById(decodedToken.userId);
    if (!userData) {
      return res.redirect("/login");
    }
    req.userData = userData;
    next();
  } catch (err) {
    const error = new Error(err);
    return next(error);
  }
};
