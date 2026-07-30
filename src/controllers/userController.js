import User from "../models/User";

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
  await User.create({
    name,
    username,
    email,
    password,
    location,
  });
  return res.redirect("/login");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
export const login = (req, res) => res.send("Login");
export const see = (req, res) => res.send("See User");
export const logout = (req, res) => res.send("Logout");
