const express = require("express");
const router = express.Router();

const {
    home,
    blogDetail,
    searchBlog,
    blogList
} = require("../controllers/homepage");

router.get("/", home);

router.get("/blog/:blogID", blogDetail);

router.get("/blog", searchBlog);

router.get('/bloglist', blogList)

module.exports = router;