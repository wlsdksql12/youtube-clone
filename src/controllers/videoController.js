let videos = [
  {
    title: "First Video",
    rating: 6,
    comments: 5,
    createdAt: "49 minutes ago",
    views: 1,
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

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const id = req.params.id;
  const video = videos[id - 1];

  return res.render("watch", {
    pageTitle: `Watching ${video.title}`,
    video,
  });
};
export const getEdit = (req, res) => {
  const id = req.params.id;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

export const postEdit = (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  videos[id - 1].title = title;
  return res.redirect(`/video/${id}`);
};
export const search = (req, res) => res.send("Search");

export const deleteVideo = (req, res) => res.send("deleteVideo");

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  //이곳에서 비디오를 videos array에 추가할 예정
  const title = req.body.title;
  const newVideo = {
    title,
    rating: 0 / 10,
    comments: 0,
    createdAt: "just now",
    views: 0,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};
