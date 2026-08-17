import express from "express";
import { registerView, test } from "../controllers/videoController";
const apiRouter = express.Router();

apiRouter.get("/video", test);
apiRouter.post("/video/:id/views", registerView);

export default apiRouter;
