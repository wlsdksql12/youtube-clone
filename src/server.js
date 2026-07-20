import express from "express";
import logger from "morgan";
import global from "./routers/globalRouter";
import user from "./routers/userRouters";
import video from "./routers/videoRouter";

const PORT = 4000;

const app = express();

app.use(logger("dev"));

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({ extended: true }));
app.use("/", global);
app.use("/video", video);
app.use("/user", user);

app.get("/login", (req, res) => {
  return res.send("Login here.");
});

const handleServer = () =>
  console.log(`Server listenting on port http://localhost:${PORT}`);

app.listen(PORT, handleServer);
