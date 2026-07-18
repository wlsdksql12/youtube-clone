const fakeUser = {
  userName: "seong jin",
  loggedIn: true,
};

export const trending = (req, res) => {
  const videos = [
    {
      title: "First Video",
      rating: 6,
      comments: 5,
      createdAt: "49 minutes ago",
      views: 59,
      id: 1,
    },
    {
      title: "Second Video",
      rating: 5,
      comments: 2,
      createdAt: "30 minutes ago",
      views: 59,
      id: 2,
    },
    {
      title: "Third Video",
      rating: 2.4,
      comments: 17,
      createdAt: "17 minutes ago",
      views: 59,
      id: 3,
    },
  ];
  return res.render("home", { pageTitle: "Home", fakeUser: fakeUser, videos });
};
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search");
export const deleteVideo = (req, res) => res.send("deleteVideo");
export const upload = (req, res) => res.send("Upload");
