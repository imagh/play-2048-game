import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: true
}));

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server is listening on ${process.env.PORT}`);
});

app.use('/', (req, res, next) => {
  return res.send((parseInt(Math.random() * 10) % 4).toString());
});