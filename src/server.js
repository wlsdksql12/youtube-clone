import express from "express";
import logger from "morgan";
import session from "express-session";
import root from "./routers/rootRouter";
import user from "./routers/userRouters";
import video from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const PORT = 4000;

const app = express();

app.use(logger("dev"));

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(localsMiddleware);
app.use("/", root);
app.use("/video", video);
app.use("/user", user);

app.get("/login", (req, res) => {
  return res.send("Login here.");
});

export default app;
