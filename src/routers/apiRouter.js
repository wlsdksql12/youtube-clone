import express from "express";
import {
  registerView,
  createComment,
  commentDelete,
} from "../controllers/videoController";
const apiRouter = express.Router();

apiRouter.post("/video/:id/views", registerView);
apiRouter.post("/video/:id/comment", createComment);
apiRouter.delete("/video/:id/commentDelete", commentDelete);

export default apiRouter;
