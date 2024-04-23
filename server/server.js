import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import router from "./router/route.js";
import connect from "./database/connectDb.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

// middlewares

app.use(bodyParser.json({ limit: "35mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "35mb",
    parameterLimit: 5000,
  })
);

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use("/favicon.ico", (req, res) => res.status(204));
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.status(201).send("HOME GET REQUEST");
});

// router
app.use("/api", router);

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
