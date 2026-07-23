import Video from "../models/video";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  }
};
export const watch = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  console.log(video.meta.views);
  return res.render("watch", {
    pageTitle: video.title,
    video,
  });
};
export const getEdit = (req, res) => {
  const id = req.params.id;
  return res.render("edit", { pageTitle: `Editing` });
};

export const postEdit = (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  return res.redirect(`/video/${id}`);
};
export const search = (req, res) => res.send("Search");

export const deleteVideo = (req, res) => res.send("deleteVideo");

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  //이곳에서 비디오를 videos array에 추가할 예정
  const { title, description, hashtags } = req.body;

  // database에 저장할 두가지 방법
  // 1번째
  try {
    await Video.create({
      title,
      description,
      createdAt: Date.now(),
      hashtags: hashtags.split(" ").map((word) => `#${word}`),
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
    console.log(error);
    return res.render("upload", {
      pageTitle: "Upload Video",
      error_Message: error._Message,
    });
  }
};
