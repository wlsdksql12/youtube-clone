import Video, { formatHashtags } from "../models/video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  }
};

export const watch = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const video = await Video.findById(id).populate("owner").populate("comments");
  console.log(video);
  if (video === null) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", {
    pageTitle: video.title,
    video,
  });
};

export const getEdit = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  if (video === null) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const id = req.params.id;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved");
  return res.redirect(`/video/${id}`);
};

export const search = async (req, res) => {
  const keyword = req.query.keyword;
  let videos = [];
  if (keyword) {
    // videos = await Video.find({
    //   title: {
    //     $regex: new RegExp(keyword, "i"),
    //   },
    // });
    const searchBy = (item) =>
      Video.find({ [item]: { $regex: new RegExp(keyword, "i") } });

    videos = await searchBy("title");

    if (videos.length === 0) {
      videos = await searchBy("hashtags");
    }
  }
  console.log("videos", videos);
  return res.render("search", { pageTitle: "Search", videos });
};

export const deleteVideo = async (req, res) => {
  const id = req.params.id;
  const user = req.session.user;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(user._id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);

  return res.redirect("/");
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  //이곳에서 비디오를 videos array에 추가할 예정
  const { title, description, hashtags } = req.body;
  const _id = req.session.user._id;
  const { video, thumb } = req.files;
  console.log(video, thumb);
  console.log(video[0].path, thumb[0].path);
  // database에 저장할 두가지 방법
  // 1번째
  try {
    await Video.create({
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path.replace(/[\\]/g, "/"),
      title,
      description,
      owner: _id,
      createdAt: Date.now(),
      hashtags: Video.formatHashtags(hashtags),
    });

    //   2번째
    //
    //   const video = new Video({
    //     title,
    //     description,
    //     createdAt: Date.now(),
    //     hashtags: hashtags.split(" ").map((word) => `#${word}`),
    //     meta: {
    //       views: 0,
    //       rating: 0,
    //     },
    //   });
    //   await video.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      error_Message: error._Message,
    });
  }
};

export const registerView = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  } else {
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
  }
};

export const createComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const { user } = req.session;
  console.log(id, text, user);

  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text: text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const commentDelete = async (req, res) => {
  const { commentId, videoId } = req.body;
  console.log(commentId, videoId);
  const comment = await Comment.findByIdAndDelete(commentId);
  const video = await Video.findById(videoId);
  console.log(commentId);
  console.log(video.comments, video.comments.length);
  video.comments = video.comments.filter((item) => item != commentId);
  console.log(video.comments, video.comments.length);

  video.save();
  return res.sendStatus(200);
};
