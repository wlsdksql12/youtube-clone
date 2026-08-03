import User from "../models/User";
import bcrypt from "bcrypt";
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  console.log(req.body);
  const { name, username, email, password, password2, location } = req.body;

  if (password !== password2) {
    return res.render("join", {
      pageTitle: "Join",
      errorMessage: "Password confirmation does not match.",
    });
  }

  const usernameExisits = await User.exists({ $or: [{ username }, { email }] });
  if (usernameExisits) {
    return res.render("join", {
      pageTitle: "Join",
      errorMessage: "This username/email is already taken",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      error_Message: error._Message,
    });
  }
};
export const edit = (req, res) => res.send("Edit User");

export const remove = (req, res) => res.send("Delete User");

export const getLogin = (req, res) =>
  res.render("Login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  // 계정 체크
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const pageTitle = "Login";
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle: pageTitle,
      errorMessage: "Wrong password.",
    });
  }
  res.redirect("/");
};

export const see = (req, res) => res.send("See User");

export const logout = (req, res) => res.send("Logout");
