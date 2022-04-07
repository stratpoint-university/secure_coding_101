const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");

const { fileFilter, blogPic, profilePic } = require("../util/multer");

const {
  userBlogs,
  addBlog,
  postBlog,
  getUserBlog,
  dashboardProfile,
  editProfile,
  renderEditProfile,
  blogEditPage,
  blogEdit
} = require("../controllers/blog");

const isAuth = require("../middleware/auth");

const router = express.Router();

router.get("/blog", isAuth, userBlogs);

router.get("/add-blog", isAuth, addBlog);

router.post(
  "/add-blog",
  isAuth,
  multer({
    storage: blogPic,
    fileFilter,
  }).single("image"),
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Title should have at least 3 length"),
    body("content")
      .trim()
      .isLength({ min: 5 })
      .withMessage(
        "Content should have a minimun of 5 text"
      ),
  ],
  postBlog
);

router.get("/profile", isAuth, dashboardProfile);

router.get("/edit-profile", isAuth, renderEditProfile);

router.post(
  "/edit-profile",
  isAuth,
  multer({
    storage: profilePic,
    fileFilter,
  }).single("profile-pic"),
  [
    body("firstname")
      .trim()
      .isAlpha()
      .withMessage("Lastname must contains only letters"),
    body("lastname")
      .trim()
      .isAlpha()
      .withMessage("Lastname must contains only letters"),
    body("username")
      .trim()
      .isAlphanumeric()
      .withMessage("Username must contains only letters and numbers"),
    body("password", "Please enter a password with at least 5 characters.")
      .isLength({ min: 5 })
      .trim(),
  ],
  editProfile
);

router.get('/blog/:blogId', isAuth, blogEditPage)

router.post(
  "/blog/:blogId",
  isAuth,
  multer({
    storage: blogPic,
    fileFilter,
  }).single("image"),
  blogEdit
);

module.exports = router;
