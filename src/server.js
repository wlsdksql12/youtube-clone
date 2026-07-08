import express from "express";

const PORT = 4000;

const app = express();

app.get("/", (req, res) => {
  console.log("somebody is trying to go home");
  return res.send("I still love you");
  //   return res.end();
});

app.get("/login", (req, res) => {
  return res.send("Login here.");
});

const handleServer = () =>
  console.log(`Server listenting on port http://localhost:${PORT}`);

app.listen(PORT, handleServer);
