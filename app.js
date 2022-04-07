const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const mongoose = require("mongoose");

const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");
const homepageRoutes = require("./routes/homepage");
const errorController = require("./controllers/error");

const MONGODB_URI =
  process.env.NODE_ENV === "development"
    ? process.env.DB_TEST
    : process.env.DB_PROD;

app.use(compression());
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.cookies.token ? true : false;
  next();
});

app.use(authRoutes);
app.use("/dashboard", blogRoutes);
app.use(homepageRoutes);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500");
});

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = app;