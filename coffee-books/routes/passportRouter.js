const express = require("express");
const passportRouter = express.Router();
const passport = require("../config/passport");

// Require User model
const User = require("../models/User");

// Signup Route
passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  User.register({ email }, password)
    .then(user => res.redirect("/private-page"))
    .catch(err => {
      if (err.name === "UserExistsError") {
        return res.render("passport/signup", {
          error: "The user is already registered"
        });
      }
    });
});

// Login Route
passportRouter.get("/login", (req, res) => {
  res.render("passport/login");
});

passportRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("passport/login", {
        error: "Could not find the combination of user and password"
      });
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      return res.redirect(`/places`);
    });
  })(req, res, next);
});

// Logout Route
passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

passportRouter.get(
  "/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

passportRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(`/places`);
  }
);

passportRouter.get(
  "/facebook/login",
  passport.authenticate("facebook", { scope: ["email"] })
);

passportRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(`/places`);
  }
);

module.exports = passportRouter;