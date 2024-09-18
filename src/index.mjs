import express from "express";

const app = express();

app.use('/', (req, res, next) => {
  return res.send("Server's up!");
});

app.listen(process.env.PORT);
console.log(`Server is listening on ${process.env.PORT}`);