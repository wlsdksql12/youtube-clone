import express from "express";
import logger from "morgan";
import global from "./routers/globalRouter";
import user from "./routers/userRouters";
import video from "./routers/videoRouter";

const PORT = 4000;

const app = express();

app.use(logger("dev"));

app.use("/", global);
app.use("/video", video);
app.use("/user", user);

// const loggerMiddleware = (req, res, next) => {
//   console.log(`Someone is going to: ${req.url}`);
//   console.log(`${req.method} ${req.url}`);
//   next();
// };

// const privateMiddleware = (req, res, next) => {
//   const url = req.url;
//   if (url === "/protected") {
//     return res.send("<h1>Not Allowed</h1>");
//   }
//   console.log("Allowed, you may continue.");
//   next();
// };

// const handleHome = (req, res) => {
//   return res.send("I love middlewares");
// };

// const handleProtected = (req, res) => {
//   return res.send("Welcome to the private lounge.");
// };

// app.use(loggerMiddleware);
// app.use(privateMiddleware);
// app.use(logger("dev"));
// app.get("/", handleHome);
// app.get("/protected", handleProtected);

app.get("/login", (req, res) => {
  return res.send("Login here.");
});

const handleServer = () =>
  console.log(`Server listenting on port http://localhost:${PORT}`);

app.listen(PORT, handleServer);
