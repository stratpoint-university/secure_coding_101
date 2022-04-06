const Blog = require("../models/blog");
const path = require("path");
const User = require('../models/user');
exports.home = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ is_draft: false, deleted_at: null })
      .populate("user_id", "username")
      .skip(3);
    const featureBlogs = await Blog.find({ is_draft: false, deleted_at: null })
      .populate(
        "user_id",
      )
      .limit(3);
    res.render("home", {
      blogs,
      featureBlogs,
      pageName: "Welcome Guy",
      pageDesc: `Hey there let me be the first one to introduce you to kewl blogs. We
            got a huge collection of random blogs.Sign up if you want to add
            some of your own stuff.`,
    });
  } catch (err) {
    return next(new Error(err));
  }
};

exports.blogDetail = async (req, res, next) => {
  const blogID = req.params.blogID;
  try {
    const blog = await Blog.findById(blogID).populate("user_id", "username");
    res.render("blog-detail", {
      blog,
    });
  } catch (err) {
    return next(new Error(err));
  }
};

exports.searchBlog = async (req, res, next) => {
  const searchWord = req.query.search;
  try {
    const blog = await Blog.find({ $text: { $search: searchWord }, is_draft: false, deleted_at: null }).populate('user_id').limit(3);
    return res.render("search-blog", { blog });
  } catch (err) {
    return next(new Error(err));
  }
};

exports.blogList = async (req, res, next) => {
  const page = req.query.page || 1;
  const ITEMS_PER_PAGE = 8;
  let totalItems = await Blog.find({
    is_draft: false,
    deleted_at: null,
  }).countDocuments();
  try {
    const blog = await Blog.find({ is_draft: false, deleted_at: null })
      .populate("user_id")
      .skip((page - 1) * 8)
      .limit(8);
    return res.render('blog-list', {
      blog,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)

    })
  }
  catch (err) {
    const error = new Error(err)
    return next(error)
  }
};
