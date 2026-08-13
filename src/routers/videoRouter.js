import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  deleteVideo,
  getUpload,
  postUpload,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);
videoRouter.get("/videos/:id", watch);
videoRouter
  .route("/videos/:id/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route("/videos/:id/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);

export default videoRouter;
