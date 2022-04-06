const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const Blog = require("../models/blog");
const fileHelper = require("../util/file");

exports.userBlogs = async (req, res, next) => {
  try {
    const blogDits = await Blog.find({
      user_id: req.userData._id, deleted_at: null
    });
    res.render("user-blog-list", {
      blog: blogDits,
      userData: req.userData,
    });
  } catch (err) {
    return next(new Error(err));
  }
};

exports.addBlog = async (req, res, next) => {
  try {
    res.render("add-blog-form", {
      userData: req.userData,
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

exports.postBlog = async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.content;
  const image = req.file;
  const isDraft = req.body.isDraft ? true : false;
  const errors = validationResult(req);
  try {
    if (!image) {
      return res.status(422).render("add-blog-form", {
        userData: req.userData,
        oldInput: {
          title,
          description,
        },
        errorMessage: "Attached file is not an image.",
      });
    }
    if (!errors.isEmpty()) {
      return res.status(422).render("add-blog-form", {
        userData: req.userData,
        oldInput: {
          title,
          description,
        },
        errorMessage: errors.array()[0].msg,
      });
    }
    const imageUrl = image.path;
    const blog = new Blog({
      _id: uuidv4(),
      title,
      description,
      cover_picture_url: imageUrl,
      user_id: req.userData._id,
      deleted_at: null,
      is_draft: isDraft,
    });

    await blog.save();
    return res.redirect("/dashboard/blog");
  } catch (err) {
    return next(new Error(err));
  }
};

exports.getUserBlog = async (req, res, next) => {
  const blogID = req.params.blogID;
  try {
    const blog = await Blog.findById(blogID).populate("user_id");
    res.render("blog-detail", {
      blog,
      userData: req.userData,
    });
  } catch (err) {
    return next(new Error(err));
  }
};

exports.dashboardProfile = (req, res, next) => {
  try {
    res.render("profile-dashboard", {
      userData: req.userData,
    });
  } catch (err) {
    next(new Error(err));
  }
};

exports.renderEditProfile = async (req, res, next) => {
  try {
    res.render("edit-profile", { userData: req.userData });
  } catch (err) {
    return next(new Error(err));
  }
};

exports.editProfile = async (req, res, next) => {
  const first_name = req.body.firstname;
  const last_name = req.body.lastname;
  const username = req.body.username;
  const password = req.body.password;
  const profileImg = req.file;
  const error = validationResult(req);
  try {
    const userData = req.userData;
    if (!error.isEmpty()) {
      console.log(error);
      return res.status(422).render("edit-profile", {
        userData,
        errorMessage: errors.array()[0].msg,
      });
    }
    const hashedPass = password;
    const currentPass = userData.password;
    if (hashedPass != currentPass && userData.password_chances > 0) {
      userData.password_chances -= 1;
      userData.first_name = first_name;
      userData.last_name = last_name;
      userData.username = username;
      userData.password = hashedPass;
      if (profileImg) {
        if (userData.profile_picture_url === null) {
          userData.profile_picture_url = profileImg.path;
        } else {
          fileHelper.deleteFile(userData.profile_picture_url);
          userData.profile_picture_url = profileImg.path;
        }
      }
      await userData.save((err) => {
        console.log(err);
      });

      return res.render("profile-dashboard", { userData });
    } else {
      userData.first_name = first_name;
      userData.last_name = last_name;
      userData.username = username;
      if (profileImg) {
        if (userData.profile_picture_url === null) {
          userData.profile_picture_url = profileImg.path;
        } else {
          fileHelper.deleteFile(userData.profile_picture_url);
          userData.profile_picture_url = profileImg.path;
        }
      }
      await userData.save((err) => {
        console.log(err);
      });
      return res.render("profile-dashboard", { userData });
    }
  } catch (err) {
    return next(new Error(err));
  }
};

exports.blogEditPage = async (req, res, next) => {
  const blogId = req.params.blogId;
  try {
    const blogData = await Blog.findById(blogId);
    return res.render("edit-blog", { blogData });
  } catch (err) {
    return next(new Error(err));
  }
};

exports.blogEdit = async (req, res, next) => {
  const blogId = req.params.blogId;
  let newTitle = req.body.title;
  let newDesc = req.body.content;
  let newImage = req.file;
  let deleted = req.body.isDeleted ? true : false;
  let isDraft = req.body.isDraft ? true : false;
  const inputError = validationResult(req);
  try {
    const blogData = await Blog.findById(blogId);
    if (!inputError.isEmpty()) {
      return res.status(422).render("edit-blog", { blogData });
    }
    if (deleted) {
      blogData.title = newTitle;
      blogData.description = newDesc;
      if (newImage) {
        if (blogData.cover_picture_url === null) {
          blogData.cover_picture_url = newImage.path;
        } else {
          fileHelper.deleteFile(blogData.cover_picture_url);
          blogData.cover_picture_url = newImage.path;
        }
      }
      blogData.is_draft = isDraft;
      blogData.deleted_at = new Date().toISOString().slice(0, 10);

      await blogData.save((err) => {
        console.log(err);
      });
      return res.redirect("/dashboard/blog");
    } else {
      blogData.title = newTitle;
      blogData.description = newDesc;
      if (newImage) {
        if (blogData.cover_picture_url === null) {
          blogData.cover_picture_url = newImage.path;
        } else {
          fileHelper.deleteFile(blogData.cover_picture_url);
          blogData.cover_picture_url = newImage.path;
        }
      }
      blogData.is_draft = isDraft;
      await blogData.save((err) => {
        console.log(err);
      });
      return res.redirect("/dashboard/blog");
    }
  } catch (err) {
    return next(new Error(err));
  }
};
