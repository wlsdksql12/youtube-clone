import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import Video from "../models/video";
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  console.log(req.body);
  const { name, username, email, password, password2, location } = req.body;
  const file = req.file;
  console.log(file);
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
      avatarUrl: file.path,
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
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const { name, email, username, location } = req.body;
  const file = req.file;
  console.log(file);
  const id = res.locals.loggedInUser._id;
  const user = await User.findOne({ _id: id });
  const findEmail = await User.findOne({ email });
  const findUserName = await User.findOne({ username });

  if (!user) {
    return res.status(400).render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "등록된 유저가 없습니다.",
    });
  }

  if (findEmail) {
    return res.render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "이미 등록된 이메일입니다.",
    });
  }

  if (findUserName) {
    return res.render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "이미 등록된 닉네임입니다.",
    });
  }

  // {new: true}는 업데이트하여 새로 생성된 정보를 updateUser에 저장
  // {new: false}는 업데이트는 하지만 정보가 바뀌기 전의 정보를 updateUser에 저장
  const updateUser = await User.findByIdAndUpdate(
    id,
    {
      avatarUrl: file ? file.path : user.avatarUrl,
      name: name,
      email: email,
      username: username,
      location: location,
    },
    { new: true },
  );
  req.session.user = updateUser;
  res.redirect("/");
};

export const remove = (req, res) => res.send("Delete User");

export const getLogin = (req, res) =>
  res.render("Login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  // 계정 체크
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
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
  req.session.loggedIn = true;
  req.session.user = user;
  res.redirect("/");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "http://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  console.log(finalUrl);
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "http://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiURL = "https://api.github.com";
    const userData = await (
      await fetch(`${apiURL}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiURL}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true,
    );
    console.log(emailObj.email);
    if (!emailObj) {
      return res.redirect("/login");
    }

    const user = await User.findOne({ emailObj: emailData.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avater_url,
        name: userData.name ? userData.name : userData.login,
        username: userData.login,
        email: emailObj.email,
        password: "",
        location: userData.location,
        socialOnly: true,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.render("/login");
  }
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Can't change password.");
    return res.redirect("/");
  }
  return res.render("change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const { password, newPassword, newPassword2 } = req.body;
  const user = req.session.user;
  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect",
    });
  }

  if (newPassword != newPassword2) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation",
    });
  }

  const findUser = await User.findById({ _id: user._id });
  findUser.password = newPassword;
  console.log(findUser.password);
  await findUser.save();
  console.log(findUser.password);
  req.session.user.password = findUser.password;
  return res.redirect("/");
};

export const see = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  console.log("여기서 잡힘");
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }
  const videos = await Video.find({ owner: user._id });
  console.log(videos);
  return res.render("profile", {
    pageTitle: `${user.name}의 Profile`,
    user,
    videos,
  });
};
